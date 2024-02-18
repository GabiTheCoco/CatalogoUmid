using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace PruebaNet8.APP.Controllers
{
    [DisableCors]
    public class CarritoController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
