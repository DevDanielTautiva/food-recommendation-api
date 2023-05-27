export const ignoreWords = ["comida"];

export const referencesWords = [  
    "dulce",     "salado",   
    "picante",   "suave",    
    "crujiente", "sabroso",  
    "amargo",    "fresco",   
    "caliente",  "delicioso",
    "ahumado",   "especiado",
    "herbáceo",  "agrio",
    "grazoso",   "ácido",
    "intenso",   "delicado",
    "cremoso",   "oleoso"
];

export const synonymsQualification = [
    'evaluacion', 'puntuacion', 'nota', 'valoracion', 'apreciacion',
    'evaluaciones', 'puntuaciones', 'notas', 'valoraciones', 'apreciaciones'
];

export const synonymsPrice = [
     'precio', 'costo', 'valor', 'tarifa', 'valoración', 'cotización',
     'precios', 'costos', 'tarifas', 'valoraciónes', 'cotizaciónes'
];

export const DinamicMsjInit: string[] = [
    "Consideramos",
    "Opinamos",
    "Estimamos",
    "Suponemos",
    "Presumimos",
    "Creemos",
    "Pensamos",
    "Sostenemos",
    "Afirmamos"
  ];

export const DinamicMsjGustos: string[] = [
    'preferencias',
    'aficiones',
    'intereses',
    'gustos',
    'inclinaciones',
    'caprichos',
    'querencias',
    'apetencias',
    'devociones'
];

export function removeTrailingS(str) {
    if (str.charAt(str.length - 1) === 's') {
        return str.slice(0, -1);
    }
    return str;
}

export function capitalizeString(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function removeSpecialCharacters(str) {
    return str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
            .replace(/[áä]/g, 'a')
            .replace(/[éë]/g, 'e')
            .replace(/[íï]/g, 'i')
            .replace(/[óö]/g, 'o')
            .replace(/[úü]/g, 'u');
}

export function isObjEmpty (obj) {
    return Object.keys(obj).length === 0;
}

export function isSimilarTo(value: string, pattern: string): boolean {
    const regexPattern = `^${pattern.replace(/%/g, '.*')}$`;
    const regex = new RegExp(regexPattern, 'i');
    return regex.test(value);
}