let baseUrl = "http://192.168.1.9:5000"

export const Api = {
    login:`${baseUrl}/api/auth/login`,
    register:`${baseUrl}/api/auth/register`,
    getCar:`${baseUrl}/api/vehicles`,
    getCarDetails:`${baseUrl}/api/vehicles`, 
    getfavorites:`${baseUrl}/api/vehicles/favorites`, 
    ProfileUpdate:`${baseUrl}/api/auth/profile`, 
    
}