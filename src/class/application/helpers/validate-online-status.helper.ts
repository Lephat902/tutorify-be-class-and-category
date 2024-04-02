import { BadRequestException } from "@nestjs/common";

export function validateOnlineStatus(isOnline: boolean, address: string, wardId: string) {
    if (isOnline === false && (!address || !wardId)) {
        throw new BadRequestException('Address and wardId are required for offline classes.');
    }
}