# Flujo de acceso a las apps (Admi Logistic TMS, etc.)

## Resumen

- **Usuario nuevo** puede **probar la demo** sin registrarse, usando un **usuario demo** (credenciales fijas).
- Para **acceso completo** (cuenta propia), el usuario debe **registrarse**; **antes** de tener acceso completo debe **pagar/contratar** el servicio.

## Flujo

1. **Probar la demo**
   - La persona entra a la app (ej. https://tms.admilogistic.es).
   - Inicia sesión con el **usuario demo** (credenciales definidas en la app o comunicadas por otro canal).
   - No hace falta registrarse.

2. **Acceso completo**
   - Si quiere usar la plataforma con su propia cuenta:
     - Debe **pagar/contratar** (según cómo esté definido en la app o comercial).
     - Después (o como parte del proceso) **registrarse**.
   - Hasta entonces no tiene acceso completo.

## Dónde se define / qué falta

- **Usuario demo:** credenciales y si se muestran en el blog o solo en la app/email.
- **Registro:** URL de registro (¿dentro de la app?, ¿landing externa?).
- **Pago/contratación:** URL o proceso (landing, formulario de contacto, pasarela de pago, etc.).

Cuando tengas estas URLs o textos definitivos, actualizar:
- `src/pages/proyectos/admin-logistic.astro` (botones y enlaces).
- Este documento.

## Referencia en el blog

- Página del producto: `/proyectos/admin-logistic` — debe ofrecer:
  - Enlace para **probar la demo** (y opcionalmente indicar que hay usuario demo).
  - Enlace o texto para **registrarse / solicitar acceso completo** (y que el acceso completo requiere pago/contratación).
