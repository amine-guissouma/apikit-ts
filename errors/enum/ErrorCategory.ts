export enum ErrorCategory {
    SERVER_UNHANDLED = "SERVER_UNHANDLED",  // erreurs backend non gérées (bug serveur / fuite)

    BUSINESS = "BUSINESS",      // erreurs backend métier

    TECHNICAL = "TECHNICAL",    // erreurs techniques (réseau / axios / sdk / infra)

    UNEXPECTED = "UNEXPECTED",

}