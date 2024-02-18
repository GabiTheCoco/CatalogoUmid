using PruebaNet8.BLL.Interfaces;
using PruebaNet8.DAL.Interfaces;
using PruebaNet8.ENTITY;
using Firebase.Auth;
using Firebase.Storage;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PruebaNet8.BLL.Implementaciones
{
    public class FirebaseService : IFirebaseService
    {
        private readonly IGenericRepository<Configuracion> _repo;

        public FirebaseService(IGenericRepository<Configuracion> repositorio)
        {
            _repo = repositorio;
        }
        public async Task<bool> EliminarStorage(string carpetaDestino, string nombreArchivo)
        {
            try
            {
                IQueryable<Configuracion> query = await _repo.Consultar(c => c.Recurso.Equals("Firebase_Storage"));

                Dictionary<string, string> Config = query.ToDictionary(keySelector: c => c.Propiedad, elementSelector: c => c.Valor);

                var auth = new FirebaseAuthProvider(new FirebaseConfig(Config["api_key"]));
                var cred = await auth.SignInWithEmailAndPasswordAsync(Config["email"], Config["clave"]);

                var cancelacion = new CancellationTokenSource();

                var tarea = new FirebaseStorage(
                    Config["ruta"],
                    new FirebaseStorageOptions
                    {
                        AuthTokenAsyncFactory = () => Task.FromResult(cred.FirebaseToken),
                        ThrowOnCancel = true
                    })
                    .Child(Config[carpetaDestino]) // acceder a la carpeta en firebase
                    .Child(nombreArchivo) // acceder al archivo en firebase
                    .DeleteAsync(); //borrar el archivo de firebase

                await tarea;

                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<string> SubirStorage(Stream streamArchivo, string carpetaDestino, string nombreArchivo)
        {
            string urlImagen = "";

            try
            {
                IQueryable<Configuracion> query = await _repo.Consultar(c => c.Recurso.Equals("Firebase_Storage"));

                Dictionary<string, string> Config = query.ToDictionary(keySelector: c => c.Propiedad, elementSelector: c => c.Valor);

                var auth = new FirebaseAuthProvider(new FirebaseConfig(Config["api_key"]));
                var cred = await auth.SignInWithEmailAndPasswordAsync(Config["email"], Config["clave"]);

                var cancelacion = new CancellationTokenSource();

                var tarea = new FirebaseStorage(
                    Config["ruta"],
                    new FirebaseStorageOptions
                    {
                        AuthTokenAsyncFactory = () => Task.FromResult(cred.FirebaseToken),
                        ThrowOnCancel = true
                    })
                    .Child(Config[carpetaDestino]) //creación de carpeta en firebase
                    .Child(nombreArchivo)
                    .PutAsync(streamArchivo, cancelacion.Token); // guardar el archivo que recibe el méotodo

                urlImagen = await tarea;
            }
            catch
            {
                return urlImagen = "";
            }

            return urlImagen;
        }
    }
}
