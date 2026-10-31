import type { BonReception } from "@/components/reception/bon-reception.types";

type ApiObject = Record<string, unknown>;

export function extractList(data: unknown): ApiObject[] {
  if (Array.isArray(data)) {
    return data.filter(
      (item): item is ApiObject =>
        typeof item === "object" && item !== null,
    );
  }

  if (typeof data !== "object" || data === null) {
    return [];
  }

  const obj = data as ApiObject;

  for (const key of [
    "data",
    "content",
    "result",
    "results",
    "items",
    "list",
    "receptions",
  ]) {
    const value = obj[key];

    if (Array.isArray(value)) {
      return value.filter(
        (item): item is ApiObject =>
          typeof item === "object" && item !== null,
      );
    }
  }

  return [];
}

function readValue(
  obj: ApiObject,
  keys: string[],
): unknown {
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null) {
      return obj[key];
    }
  }

  return undefined;
}

function toNumber(value: unknown): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const result = Number(value.replace(",", ".").trim());
    return Number.isFinite(result) ? result : 0;
  }

  return 0;
}

function toBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;

  if (typeof value === "string") {
    return ["true", "1", "oui", "yes"].includes(
      value.trim().toLowerCase(),
    );
  }

  return false;
}

function formatDate(value: unknown): string {
  if (value === undefined || value === null || value === "") {
    return "";
  }

  if (Array.isArray(value) && value.length >= 3) {
    const [year, month, day] = value;

    return `${String(day).padStart(2, "0")}/${String(month).padStart(
      2,
      "0",
    )}/${year}`;
  }

  const raw = String(value).trim();
  const isoMatch = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (isoMatch) {
    return `${isoMatch[3]}/${isoMatch[2]}/${isoMatch[1]}`;
  }

  return raw;
}

export function normalizeBonReception(
  item: ApiObject,
): BonReception | null {
  const rawId = readValue(item, [
    "id",
    "receptionId",
    "idReception",
    "id_reception",
  ]);

  if (rawId === undefined || rawId === "") {
    console.warn("Identifiant absent pour ce bon :", item);
    return null;
  }

  return {
    id: toNumber(rawId),

    reference: String(
      readValue(item, [
        "reference",
        "ref",
        "referenceReception",
        "referenceBon",
      ]) ?? "",
    ),

    compteId: toNumber(
      readValue(item, ["compteId", "idCompte", "compte_id"]),
    ),

    name: String(
      readValue(item, ["name", "nom", "client", "nomClient"]) ?? "",
    ),

    mobile: String(
      readValue(item, ["mobile", "telephone", "tel", "phone"]) ?? "",
    ),

    quantityOil: toNumber(
      readValue(item, [
        "quantityOil",
        "quantiteHuile",
        "quantite_huile",
      ]),
    ),

    quantityOlive: toNumber(
      readValue(item, [
        "quantityOlive",
        "quantiteOlive",
        "quantite_olive",
      ]),
    ),

    priceKg: toNumber(
      readValue(item, ["priceKg", "prixKg", "prix_kg"]),
    ),

    price: toNumber(
      readValue(item, ["price", "prix", "montant"]),
    ),

    payement: toNumber(
      readValue(item, ["payement", "payment", "paiement"]),
    ),

    acompte: toNumber(
      readValue(item, ["acompte", "avance"]),
    ),

    statusId: toNumber(
      readValue(item, ["statusId", "idStatut", "status_id"]),
    ),

    statusLib: String(
      readValue(item, [
        "statusLib",
        "libelleStatut",
        "status",
      ]) ?? "",
    ),

    caisse: toNumber(
      readValue(item, ["caisse", "nomCaisse"]),
    ),

    natureId: toNumber(
      readValue(item, ["natureId", "idNature", "nature_id"]),
    ),

    priceOil: toNumber(
      readValue(item, ["priceOil", "prixHuile", "prix_huile"]),
    ),

    observation: String(
      readValue(item, ["observation", "remarque"]) ?? "",
    ),

    typeHuile: String(
      readValue(item, [
        "typeHuile",
        "idTypeHuile",
        "type_huile",
      ]) ?? "",
    ),

    isBaseCompte: toBoolean(
      readValue(item, [
        "isBaseCompte",
        "baseCompte",
        "is_base_compte",
      ]),
    ),

    dateCreation: formatDate(
      readValue(item, ["dateCreation", "date", "createdDate"]),
    ),

    dateDebProduction: formatDate(
      readValue(item, [
        "dateDebProduction",
        "dateDebutProduction",
      ]),
    ),

    dateFinProduction: formatDate(
      readValue(item, ["dateFinProduction"]),
    ),
  };
}