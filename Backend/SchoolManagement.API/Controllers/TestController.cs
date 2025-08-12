using Microsoft.AspNetCore.Mvc;

namespace SchoolManagement.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class TestController : ControllerBase
{
    /// <summary>
    /// Test endpoint to verify API is working
    /// </summary>
    /// <returns>Simple test response</returns>
    [HttpGet("ping")]
    public ActionResult<object> Ping()
    {
        return Ok(new 
        { 
            message = "API is working correctly",
            timestamp = DateTime.UtcNow,
            version = "1.0.0"
        });
    }

    /// <summary>
    /// Test CORS endpoint
    /// </summary>
    /// <returns>CORS test response</returns>
    [HttpGet("cors")]
    public ActionResult<object> TestCors()
    {
        return Ok(new 
        { 
            message = "CORS is configured correctly",
            origin = Request.Headers["Origin"].FirstOrDefault(),
            timestamp = DateTime.UtcNow
        });
    }
}