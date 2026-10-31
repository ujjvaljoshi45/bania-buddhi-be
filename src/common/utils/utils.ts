import { customAlphabet } from 'nanoid';
export class Utils {

    static generateReferenceId(): string {
        const ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
        return customAlphabet(ALPHABET, 10)();
    }
}