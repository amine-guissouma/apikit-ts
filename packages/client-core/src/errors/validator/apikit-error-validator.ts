// apikit-error-validator.ts

import axios, { AxiosError } from "axios";
import { ZodError } from "zod";
import { ApikitException } from "../../exception/apikit-exception";
import { AxiosErrorValidator } from "./axios-error-validator";

export class ApikitErrorValidator {

    constructor(
        private readonly error: unknown
    ) {}

    // apikit
    isApikitException(): boolean {
        return this.error instanceof ApikitException;
    }
    getApikitException(): ApikitException {
        return this.error as ApikitException;
    }

    // zod
    isZodError(): boolean {
        return this.error instanceof ZodError;
    }
    getZodError(): ZodError {
        return this.error as ZodError;
    }

    // axios
    isNotAxiosError(): boolean {
        return !axios.isAxiosError(this.error);
    }

    getAxiosError(): AxiosError {
        return this.error as AxiosError;
    }

    getAxiosErrorValidator(): AxiosErrorValidator {
        return new AxiosErrorValidator(
            this.getAxiosError()
        );
    }
}