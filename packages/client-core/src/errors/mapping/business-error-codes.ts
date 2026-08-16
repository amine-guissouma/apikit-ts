import { ErrorCategory } from "../enum/ErrorCategory";

class BusinessErrorManager {
    private codes: Record<string, ErrorCategory> = {};

    set(codes: Record<string, ErrorCategory>): void {
        this.codes = { ...this.codes, ...codes };
    }

    get(): Record<string, ErrorCategory> {
        return this.codes;
    }

    has(code: string): boolean {
        return code in this.codes;
    }

    getCategory(code: string): ErrorCategory | undefined {
        return this.codes[code];
    }
}

export const BusinessErrorRegistry = new BusinessErrorManager();

