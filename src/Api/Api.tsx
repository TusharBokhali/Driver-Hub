let baseUrl = "https://drivehubpro-backend.onrender.com"

export const Api = {
    login:`${baseUrl}/api/auth/login`,
    register:`${baseUrl}/api/auth/register`,
    getCar:`${baseUrl}/api/vehicles`,
    getCarDetails:`${baseUrl}/api/vehicles`, 
    getfavorites:`${baseUrl}/api/vehicles/favorites`, 
    ProfileUpdate:`${baseUrl}/api/auth/profile`, 
    
}