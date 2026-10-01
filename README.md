# Xpense · demo móvil

Demo de Xpense en React Native y Expo, basado en el borrador HTML suministrado. Usa NativeWind (Tailwind para React Native) para los estilos. Funciona sin backend: el inicio de sesión, los gastos, los pagos y la vinculación bancaria son simulados. Los cambios se guardan localmente en el teléfono.

## Abrirlo en el teléfono

1. Instala **Expo Go** en el teléfono y asegúrate de que el computador y el teléfono estén en la misma red Wi-Fi.
2. En una terminal, desde esta carpeta, ejecuta:

   ```bash
   npm install
   npx expo start
   ```

3. Espera a que aparezca el código QR. En **Android**, abre Expo Go y usa **Scan QR code**. En **iPhone**, escanéalo con la app Cámara. Mantén la terminal abierta mientras usas el demo.
4. Si usas un iPhone, inicia sesión en la CLI con `npx expo login` y en Expo Go con la **misma cuenta**. Comprueba la sesión con `npx expo whoami` antes de escanear el QR.
5. Si el teléfono no logra conectarse por la red local, prueba `npx expo start --tunnel` y escanea el nuevo QR. Expo puede pedir instalar una dependencia para el túnel.

No necesitas crear ni vincular un proyecto en el panel de Expo para probar este demo con Expo Go. El comando `eas init --id ...` sirve para conectar esta carpeta con un proyecto de **EAS** ya existente; úsalo solo si después quieres servicios de EAS, como compilar una app instalable o publicar actualizaciones. La instalación global de `eas-cli` tampoco es necesaria para escanear el QR.

### Acceso de prueba

- Correo: `demo@xpense.app`
- Contraseña: `demo1234`

No uses credenciales bancarias reales en la simulación de vinculación. Esa pantalla acepta valores inventados y los descarta al avanzar.

## Recorrido del demo

- **Inicio:** saldo, meta de ahorro, microgastos, recomendación diaria, gráfico semanal y movimientos recientes.
- **Análisis:** gastos por día, semana y mes, categorías, efecto de microgastos y todos los movimientos.
- **Gemelo IA:** actualización de meta e ingreso, aportes a ahorro, simulación de hábitos y opciones de comida ilustrativas.
- **Pagos:** cafetería, transporte y parqueadero simulados.
- **Vincular:** elección de banco, paso de prueba, consentimiento, movimientos automáticos de ejemplo y desvinculación.

Usa **Restaurar datos de ejemplo** en la pantalla Vincular para empezar de nuevo. Cerrar sesión conserva los datos locales del demo.

## Verificaciones

```bash
npm run typecheck
npm run lint
npx expo export --platform android
```

Proyecto preparado para Expo SDK 57. Recomendamos Node.js LTS compatible con ese SDK.
