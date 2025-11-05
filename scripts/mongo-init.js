db = db.getSiblingDB('empresas');

// Colecciones base
db.createCollection('empresas');
db.createCollection('sucursales');
db.createCollection('puntos_venta');
db.createCollection('cufd');

// Índices y unicidad
db.empresas.createIndex({ nit: 1 }, { unique: true });

db.sucursales.createIndex(
    { empresaId: 1, codigoSucursal: 1 },
    { unique: true }
);
db.sucursales.createIndex({ empresaId: 1 });

db.puntos_venta.createIndex(
    { sucursalId: 1, codigoPuntoVenta: 1 },
    { unique: true }
);
db.puntos_venta.createIndex({ sucursalId: 1 });

// 1 CUFD activo por (Sucursal,PdV)
db.cufd.createIndex(
    { codigoSucursal: 1, codigoPuntoVenta: 1 },
    { unique: true, partialFilterExpression: { estado: "ACTIVO" } }
);

// ejemplo
db.empresas.insertOne({
    nit: "1020304050",
    razonSocial: "Acme SRL",
    correo: "contacto@acme.bo",
    estado: true,
    creadoEn: new Date()
});

print("Colecciones e índices creados en 'empresas'.");