# Establece la imagen base
FROM node:16.16.0

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el archivo package.json y package-lock.json al directorio de trabajo
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# genera data seeding del proyecto  
CMD [ "npm", "run", "generate:migration" ]

# Copia el código fuente de la aplicación al directorio de trabajo
COPY . .

# Expone el puerto en el que se ejecutará la aplicación
EXPOSE 5000

# Comando para ejecutar la aplicación
CMD [ "npm", "run", "start" ]
