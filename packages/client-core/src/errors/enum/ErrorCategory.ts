export enum ErrorCategory {
    SERVER = "SERVER",  // erreurs backend identifier mais non gérées (bug serveur / fuite)

    SERVER_UNEXPECTED = "SERVER_UNEXPECTED",  // erreurs backend non gérées (bug serveur / fuite) erreur 500

    SERVER_UNAVAILABLE = 'SERVER_UNAVAILABLE' ,   // impossibilité de joindre le server

    TECHNICAL = "TECHNICAL",                    // erreurs techniques (réseau / axios / sdk / infra)

    CONTRACT= "CONTRACT",                       // erreurs contract non respecter

    BUSINESS = "BUSINESS",                      // erreurs backend identifier -> métier le developper front doit metre en place le comportement repondant a une spec

    AUTHENTICATION =    "AUTHENTICATION",       // erreur business specifique a l'authenification

    AUTHORIZATION =     'AUTHORIZATION' ,       // erreur business specifique a l'authorisation

    CANCELLED ='CANCELLED' ,                    // erreur d'anulation de requette

    UNEXPECTED = "UNEXPECTED",                  // erreur innatendu front / cleint ...
}