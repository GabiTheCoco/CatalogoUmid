Catalog Umid - Proyecto Web MVC con .Net 8

Este repositorio contiene un proyecto de ejemplo de una aplicación ASP.NET Core utilizando el patrón de diseño Modelo-Vista-Controlador (MVC). 
El objetivo de esta aplicación es proporcionar un caso práctico para comprender los conceptos fundamentales de ASP.NET Core y el desarrollo de aplicaciones web.

Contenido

    Instalación
    Configuración de la Base de Datos
    Configuración de la Cadena de Conexión
    Video de Demostración
    Requisitos del Entorno
    Ejecución del Proyecto

Instalación

Para comenzar, clone este repositorio en su máquina local utilizando el siguiente comando:

bash

git clone https://github.com/TuUsuario/PruebaNet8.git

Configuración de la Base de Datos
Opción 1: Crear la Base de Datos con un Query

Puede utilizar el siguiente script SQL para crear la base de datos:

sql

-- Script para crear la base de datos
CREATE DATABASE PruebaNet8;

Opción 2: Crear la Base de Datos con Migraciones

Si prefiere utilizar migraciones de Entity Framework, abra una terminal en el directorio del proyecto y ejecute los siguientes comandos:

bash

dotnet ef migrations add InitialCreate
dotnet ef database update

Configuración de la Cadena de Conexión

Edite el archivo appSettings.json en la capa de aplicación y ajuste la cadena de conexión para reflejar la configuración de su base de datos recién creada.

json

{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=PruebaNet8;Trusted_Connection=True;"
  },
  // ...
}

Video de Demostración

Se ha creado un video de demostración que proporciona una visión general del funcionamiento de la aplicación. Puede ver el video aquí.
Requisitos del Entorno

Asegúrese de tener instalados los siguientes elementos en su entorno de desarrollo:

    .NET 8 SDK: Descargar aquí
    Visual Studio (o Visual Studio Code) con soporte para desarrollo web ASP.NET Core.
    SQL Server 2022: Descargar aquí

Ejecución del Proyecto

    Abra el proyecto en Visual Studio.
    Asegúrese de que la cadena de conexión en appSettings.json esté configurada correctamente.
    Ejecute la aplicación.

¡Listo! Ahora puede explorar y modificar este proyecto de ejemplo de ASP.NET Core para entender mejor el patrón MVC y los conceptos relacionados con el desarrollo web. ¡Disfrute explorando!
