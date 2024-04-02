import { Class } from "src/class/infrastructure/entities";
import { AddressProxy } from "../proxies";

export async function getGeocodeObject(addressProxy: AddressProxy, address: string, wardId: string): Promise<Class['location']> {
    // Get geocode if address is provided
    if (address && wardId) {
        const geocode = await addressProxy.getGeocodeFromAddressAndWardId(address, wardId);
        if (geocode) {
            return {
                type: 'Point',
                coordinates: [parseFloat(geocode.lon), parseFloat(geocode.lat)]
            }
        }
    }

    return null;
}