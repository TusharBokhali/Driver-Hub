// export let baseUrl = "http://192.168.1.5:5000"
export let baseUrl = "https://drivehub-backend-4eb1.onrender.com"

export const Api:any = {
    // user
    login:`${baseUrl}/api/auth/login`,
    register:`${baseUrl}/api/auth/register`,
    getCar:`${baseUrl}/api/vehicles`,
    getCarDetails:`${baseUrl}/api/vehicles`, 
    getfavorites:`${baseUrl}/api/vehicles/favorites`, 
    ProfileUpdate:`${baseUrl}/api/auth/profile`,
    
    
    // Admin
    dashboard:`${baseUrl}/api/dashboard`,
    AllVehical:`${baseUrl}/api/admin/vehicles`,
    
    // Notificatons Api
    new_token:`${baseUrl}/api/notifications/push-token`,
    Vehical_booking:`${baseUrl}/api/booking-flow/bookings`,
    get_notifications:`${baseUrl}/api/notifications`,
    clean_notifications:`${baseUrl}/api/notifications/clear-all`,
    

}