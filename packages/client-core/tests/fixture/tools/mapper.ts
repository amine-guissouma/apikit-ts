import {expect} from "vitest";
import {ErrorDefinition} from "../../../src/http/mapper-error-tool";
import {ErrorCategory} from "../../../src/errors/enum/ErrorCategory";

export function mapperKeysValidator(    mapper: Record<string, unknown>, expectedKeys: (string)[]) {
    const mapperKeys = Object.keys(mapper);

    // Vérifie le nombre de clés
    expect(mapperKeys).toHaveLength(expectedKeys.length);
    // Vérifie que toutes les clés attendues existent, sans tenir compte de l'ordre
    expect([...mapperKeys].sort()).toEqual([...expectedKeys].sort());}


const CHAR_AUTHORIZED = /^APIKIT_[A-Z0-9]+(?:_[A-Z0-9]+)*$/;
const PREFIX = "APIKIT";


export function apikitErrorCodeNamingValidator(
    code: string,
    key: string,
) {

    const parts = code.split("_");
    /** test for [KEY]_[DESCRIPTION]*/

    // Préfixe APIKIT
    expect(parts[0]).toBe(PREFIX);

    // si domaine on test le domaine
    const keyStart = 0;

    // La clé peut elle-même contenir "_"
    const keyParts = key.split("_");

    const codeKeyParts = parts.slice(keyStart, keyStart + keyParts.length);

    // La clé doit correspondre
    expect(codeKeyParts).toEqual(keyParts);

    // La clé doit être entièrement présente
    expect(parts.length).toBeGreaterThanOrEqual(keyStart + keyParts.length);

    // Uniquement des caractères autorisés
    expect(code).toMatch(CHAR_AUTHORIZED);
}



export function errorCodeNamingValidator(
    code: string,
    domain: string | undefined,
    key: string,
) {
    /** test for APIKIT_[DOMAIN]_[KEY]_[DESCRIPTION]*/
    const parts = code.split("_");
    // Préfixe APIKIT
    expect(parts[0]).toBe(PREFIX);

    // si domaine on test le domaine
    expect(parts[1]).toBe(domain);

    // La clé commence après APIKIT_[DOMAIN].
    const keyStart = 2;


    // La clé peut elle-même contenir "_"
    const keyParts = key.split("_");
    const codeKeyParts = parts.slice(keyStart, keyStart + keyParts.length);

    // La clé doit correspondre
    expect(codeKeyParts).toEqual(keyParts);

    // La clé doit être entièrement présente
    expect(parts.length).toBeGreaterThanOrEqual(keyStart + keyParts.length);

    // Uniquement des caractères autorisés
    expect(code).toMatch(/^APIKIT_[A-Z0-9]+(?:_[A-Z0-9]+)*$/);
}


export function errorDefinitionValidator(
    definition: ErrorDefinition,
) {
    expect(definition).toBeDefined();

    expect(definition).toHaveProperty("code");
    expect(definition).toHaveProperty("message");
    expect(definition).toHaveProperty("category");

    expect(typeof definition.code).toBe("string");
    expect(typeof definition.message).toBe("string");
    // La catégorie est bien une valeur de ErrorCategory
    expect(Object.values(ErrorCategory)).toContain(definition.category);}

export function mapperCategoryValidator(
    mapper: Record<string | number, ErrorDefinition>,
    key: string | number,
    expectedCategory: ErrorCategory,
) {
    const definition = mapper[key];

    expect(definition, `La définition associée à la clé "${key}" doit être définie`,).toBeDefined();

    expect(
        definition.category,
        `La clé "${key}" doit avoir la catégorie "${expectedCategory}"`,
    ).toBe(expectedCategory);
}