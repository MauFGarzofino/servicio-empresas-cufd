db = db.getSiblingDB('empresas');

// colecciones base
db.createCollection('empresas');
db.createCollection('sucursales');
db.createCollection('puntos_venta');
db.createCollection('cufd');

// índices
db.empresas.createIndex({ nit: 1 }, { unique: true });
db.sucursales.createIndex({ empresaId: 1, codigoSucursal: 1 }, { unique: true });
db.puntos_venta.createIndex({ sucursalId: 1, codigoPuntoVenta: 1 }, { unique: true });

// un CUFD activo por (sucursal, pdv)
db.cufd.createIndex(
    { codigoSucursal: 1, codigoPuntoVenta: 1 },
    { unique: true, partialFilterExpression: { estado: "ACTIVO" } }
);

print("Indices de servicio-empresas-cufd creados");