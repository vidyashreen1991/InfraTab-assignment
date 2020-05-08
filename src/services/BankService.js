export async function getBanksDetails(city){
    try {
        let response = await fetch(`https://vast-shore-74260.herokuapp.com/banks?city=${city.toUpperCase()}`);
        return response.json();
    } catch(err){
        console.error(err);
        // TODO: Error handling
        return [];
    }
    
}