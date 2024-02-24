
# Catalogo Umid - Proyecto Web 

**Contenido**

[TOC]

#Instalación
Para comenzar, clone este repositorio dentro de su máquina local o repositorio local utilizando el siguiente comando:  

`git clone https://github.com/GabiTheCoco/CatalogoUmid.git`

#Requisitos del entorno

Este proyecto utiliza .NET Framework 8.0.200 (Viene incluído en el Visual Studio 17.9.0) o se puede descargar en [este enlace](https://dotnet.microsoft.com/es-es/download/dotnet/8.0).

También utiliza los siguientes programas:

- Visual Studio Community 2022 - 17.9.0, con las siguientes cargas de trabajo instaladas: Desarrollo de ASP.NET y web, Desarrollo de escritorio de .NET y Almacenamiento y procesamiento de datos.

- SQL Server Management Studio 19 o posterior.

- Los paquetes de NuGet y las dependencias necesarias están dentro del proyecto mismo.

#Configuración de la Base de Datos
Una vez clonado el proyecto, se debe crear una Base de Datos para almacenar los registros pertinentes durante la ejecución de la aplicación.

Esto se puede hacer de dos maneras:

- Dentro de la capa de aplicación, se puede crear una migración de Entity Framework, abriendo una terminal  y ejecutando los siguientes comandos:

		dotnet ef migrations add Migracion
		dotnet ef database update

- Ejecutar dentro de SQL server 2022 la siguiente query:


	use TuBaseDeDatos;

	create table Categorias(
		Id int primary key identity(1,1),
		Nombre varchar(50),
		EsActivo bit,
		FechaRegistro datetime default getdate()
	);

	create table Productos(
		Id int primary key identity(1, 1),
		Nombre varchar(50),
		Marca varchar(50),
		Descripcion varchar(500),
		Stock int,
		Precio decimal(10,2),
		EsActivo bit,
		FechaRegistro datetime default getdate(),
		IdCategoria int references Categorias(Id),
	);

	create table ImagenesProductos(
		Id int primary key identity(1,1),
		Nombre varchar(100),
		UrlImagen varchar(500),
		IdProducto int references Productos(Id)
	);

	create table Configuraciones(
		Recurso varchar(50),
		Propiedad varchar(50),
		Valor varchar(60)
	);


Dentro de la capa de aplicación, modificar la cadena de conexión una vez creada la base de datos pertinente, con la siguiente fórmula:

	
	
	"ConnectionStrings": {
		  "cadenaSQL": "Server=(tuServidor);Database=(tuBaseDeDatos);Integrated Security=true;MultipleActiveResultSets=true;TrustServerCertificate=True"
		}

#Configuración del servicio de Firebase Storage

Este proyecto utiliza el servicio Firebase Storage para guardar las imágenes de los productos y almacenarlas, se debe configurar un nuevo proyecto de Firebase con una cuenta de Google de la siguiente manera:

1. Accede a la [Consola de Firebase](https://console.firebase.google.com/u/0/).

2. Crear un nuevo proyecto con un nombre a elección propia, desactivando la opción de Google Analytics.

3. Una vez creado el proyecto, acceder al apartado de Compilación -> Storage en el panel lateral y clickear el botón de empezar a utilizar esta característica.

4. En el primer paso de la ventana "Configura Cloud Storage" se selecciona la "Iniciar en modo de producción" y se aprieta el botón de avanzar.

5. En el segundo paso de la ventana "Configura el Cloud Storage" seleccionar la ubicación del servidor a "southamerica-east1" y se aprieta el botón de listo.

6. Guardar en un apartado la URL que aparece una vez haya creado el servicio, ya que esta es la dirección para obtener acceso a la carpeta donde se guardarán las imágenes.

7. En el apartado de "Rules" cambiar las reglas por defecto a por las siguientes y aplicar los cambios:

		rules_version = '2';
		service firebase.storage {
		  match /b/{bucket}/o {
			match /{allPaths=**} {
			  allow read;
					allow write: if request.auth != null;
			}
		  }
		}

8. Se accede al apartado de "Compilación -> Authentication" y se habilita el acceso a los archivos a través de un correo electrónico y una contraseña dentro de la pestaña "Método de acceso".

9. En la pestaña Usuarios agregar un nuevo Usuario (un correo electrónico válido o no válido, mientras tenga el formato de correo@gmail.com) y Contraseña, las cuales debe guardar en un apartado para usarla después.

10. Una vez completado los pasos anteriores, acceder al apartado "Configuración del proyecto" en el panel lateral y dentro de la pestaña "General" se puede ver un campo "Clave de API web" con un valor alfanumérico; se debe guardar este valor, ya que es la api key que nos permite acceder al servicio de firebase.

Luego de eso, se debe acceder a la base de datos creada anteriormente y ejecutar el siguiente query después de haberlo modificado con los valores pertinentes:

	insert into Configuraciones values
	('Firebase_Storage', 'email' ,'TuEmailDeUsuario'),
	('Firebase_Storage', 'clave' ,'TuContraseñaDeUsuario'),
	('Firebase_Storage', 'ruta' ,'TuRutaDeAccesoAlServicio'),
	('Firebase_Storage', 'api_key' ,'TuApiKey'),
	('Firebase_Storage', 'carpeta_producto' ,'IMAGENES_PRODUCTOS');

- La ruta de acceso al servicio no debe tener la parte del "gs://" en su cadena al ingresar en la base de datos, tenerlo en cuenta.
#Video Demostración
Se creó un video en el que se explica las distinas funcionalidades de la aplicación, tanto las del Usuario corriente como las del Usuario Administración, encontrándose en [este enlace](https://youtu.be/5977AhUyQ0s)

#Ejecución del proyecto
Se puede ejecutar el proyecto abriendo el archivo CatalogoUmid.sln y ejecutando la solución con el proyecto de inicio en la capa de aplicación CatalogoUmid.APP 
