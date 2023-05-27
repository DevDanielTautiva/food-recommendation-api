import { Injectable } from '@nestjs/common';
import { Model } from 'dynamoose/dist/Model';
import { Restaurant } from '../entities/restaurant.entity';

import * as dynamoose from 'dynamoose';
import * as fs from 'fs';

import { restaurantSchema } from '../entities/restautant.shema';
import { RecommendationsDto, RecommendationsResponseDto } from '../dto/recommendations.dto';
import { ScanResponse } from 'nestjs-dynamoose';

import { DinamicMsjGustos, DinamicMsjInit, capitalizeString, ignoreWords, isObjEmpty, isSimilarTo, referencesWords, removeTrailingS, synonymsPrice, synonymsQualification } from 'src/helpers/helpers';

@Injectable()
export class RecommendationService {

    private dbRestaurant: Model<Restaurant>;
    private tableName = 'restaurants';

    constructor() { 
        this.dbRestaurant = dynamoose.model<Restaurant>(this.tableName, restaurantSchema);
    }

    async recommend({ search }: RecommendationsDto){
        try {       

            let query: ScanResponse<Restaurant> = await this.dbRestaurant.scan().exec()


            // filtro Description y por tipo de restaurante 
            let recomentations: any = await this.likes(search);
 
            // Filtro Caracterizacion del usuario
            recomentations = await this.characterizacion(recomentations, search, query);

            // Filtro Referencias a la comida
            recomentations = await this.references(recomentations, search, query);

            // Filtro Ingredientes
            recomentations = await this.ingredients(recomentations, search, query); 

            // Condicionales
            recomentations = Object.values(recomentations);

            const words = search.split(" ");
            const matchingQua: string[] = words.filter((word) => synonymsQualification.includes(word))

            if(matchingQua.length > 0){
                recomentations = await this.sortByQualificationDesc(recomentations);
            }
            
            const matchingPrice: string[] = words.filter((word) => synonymsPrice.includes(word))

            if(matchingPrice.length > 0){
                recomentations = await this.sortByPriceAsc(recomentations);
            }

            let response: RecommendationsResponseDto = {
                search: `Se encontraron un total de ${recomentations.length} resultados`,
                message: `¡${DinamicMsjInit[Math.floor(Math.random() * 9)]} que estos son los restaurantes que más se ajustan a tus ${DinamicMsjGustos[Math.floor(Math.random() * 9)]}!, deseamos sean de tu agrado y los disfrutes. ¡Bon appétit!.`,
                recomentations
            };
            
            if (recomentations.length == 0) {

                let query: ScanResponse<Restaurant> = await this.dbRestaurant.scan().limit(10).exec();
                recomentations = await this.sortByQualificationDesc(query);

                response = {
                    search: `Se encontraron un total de ${recomentations.length} resultados`,
                    message: 'No se encontraron restaurantes que coincidan con tus gustos, sin embargo te compartimos los restaurantes con calificación más destacada, según nuestra analítica.',
                    recomentations
                };
            }

            return response;

        } catch (error) {
            return {
                search: `Se encontraron un total de 0 resultados`,
                message: 'Ocurrió un error al buscar restaurantes.',
                error
            };
        }
    }

    async randomize(query: ScanResponse<Restaurant>){

        const randomIndexes:any = [];
        const randomRestaurants:any = [];
      
        while (randomIndexes.length < 20) {
          const randomIndex = Math.floor(Math.random() * query.length);
          if (!randomIndexes.includes(randomIndex)) {
            randomIndexes.push(randomIndex);
          }
        }
    
        // Obtiene los elementos aleatorios según los índices generados
        randomIndexes.forEach(index => {
          randomRestaurants.push(query[index]);
        });
      
        return randomRestaurants;
    }

    async likes(search: string){

        const words = search.split(" ");
        let result = {};

        for await(let item of words){
            if(item.length > 4 && !ignoreWords.includes(item.toLocaleLowerCase())){

                item = removeTrailingS(item); 

                let queryfoodType: ScanResponse<Restaurant> = await this.dbRestaurant.scan()
                    .where("foodType").contains(capitalizeString(item))
                .exec();

                for await(let restaurant of queryfoodType){
                    result[restaurant.id] = restaurant;
                };

                let querydescription: ScanResponse<Restaurant> = await this.dbRestaurant.scan()
                    .where("description").contains(capitalizeString(item))
                .exec();

                for await(let restaurant of querydescription){
                    result[restaurant.id] = restaurant;
                };
            }
        }

        return result;

    }

    async characterizacion(recomentations: object, search: string, query: ScanResponse<Restaurant>){

        const words = search.split(" ");
        const characterization =  JSON.parse(fs.readFileSync('src/database/dictionary/characterization.json', 'utf-8'));
        
        for await(let [key, value] of Object.entries(words)){

            if(characterization[value]){

                let arrayCharacter:string[] = characterization[value].split(",");

                for await (const restaurant of query) {

                    let flag:boolean = true;

                    for await (const menu of restaurant.menus) {

                        let ingredientes: string[] =  menu.ingredients.split(", ").map(ingredient => {
                            return ingredient.toLocaleLowerCase()
                        });

                        flag = true;

                        for await (const word of arrayCharacter) {
                            if(ingredientes.includes(word)){
                                flag = false; 
                            }

                            if(!flag) break;
                        }  
                        
                        if(!flag) break;
                    } 

                    if(flag){
                        recomentations[restaurant.id] = await restaurant;  
                    }
                }
            }
        }

        return recomentations;

    }

    async references(recomentations: object, search: string, query: ScanResponse<Restaurant>){

        const words: string[] = search.split(" ");
        const matching: string[] = words.filter((word) => referencesWords.includes(word.toLowerCase()))

        if(matching.length > 0){

            const filteredQuery: Restaurant[] = query.filter(item => {
                return matching.every(word => referencesWords.includes(word.toLowerCase()));
            });

            for await (const iterator of filteredQuery) {
                recomentations[iterator.id] = iterator;
            }
        }

        return recomentations;

    }

    async ingredients(recomentations: object, search: string, query: ScanResponse<Restaurant>){

        // if(!isObjEmpty(recomentations)){
        //     return recomentations;
        // }

        const words: string[] = search.split(" ");

        for await(let [key, word] of Object.entries(words)){

            for await (const restaurant of query) {

                let flag:boolean = true;

                for await (const menu of restaurant.menus) {

                    flag = true;

                    let ingredientes: string[] = menu.ingredients.split(", ").map(ingredient => {
                        return ingredient.toLocaleLowerCase()
                    });

                    if(ingredientes.includes(word.toLocaleLowerCase())){
                        flag = false; 
                    }

                    if(isSimilarTo(menu.name, `%${word.toLocaleLowerCase()}%`)){
                        flag = false; 
                    }

                    if(!flag) break;
                } 

                if(!flag){
                    recomentations[restaurant.id] = await restaurant;  
                }
            }    
        }
        
        return recomentations;

    }

    // Ordenar por qualification de mayor a menor
    sortByQualificationDesc(recomentations: any){
        return recomentations.map(item => ({
            ...item,
            menus: item.menus.sort((a, b) => parseFloat(b.qualification) - parseFloat(a.qualification))
        }));
    }

    // Ordenar por price de menor a mayor
    sortByPriceAsc(recomentations: any){
        return recomentations.map(item => ({
            ...item,
            menus: item.menus.sort((a, b) => parseFloat(a.price.substring(1)) - parseFloat(b.price.substring(1)))
        }));
    };
    
}