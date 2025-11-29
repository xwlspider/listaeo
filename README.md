📋 Aplicación de Gestión de Tareas - React Native + Expo
📖 Descripción del Proyecto
Aplicación móvil de gestión de tareas (To-Do List) desarrollada con React Native, Expo Router y TypeScript. Permite crear, leer, actualizar y eliminar tareas sincronizadas con una API REST usando Axios.
✨ Características principales:

✅ CRUD completo de tareas (Create, Read, Update, Delete)
🌐 Sincronización con API REST mediante Axios
🔄 Estado global con Context API
✅ Validación de formularios con Zod
📱 Navegación con Expo Router
🎨 UI moderna con componentes nativos de React Native
♻️ Pull to refresh para recargar datos
🔔 Alertas de confirmación antes de eliminar
⚠️ Problema Conocido: Edición de Tareas No Funciona
🔍 Diagnóstico del problema
Síntoma: Al intentar editar una tarea, la aplicación muestra un error 404.
Causa raíz: El servidor json-server NO está sirviendo correctamente las rutas individuales (/tasks/:id).
Verificación del problema:

GET /tasks funciona ✅ - Muestra todas las tareas
GET /tasks/1 falla ❌ - Retorna 404 Not Found
PUT /tasks/1 falla ❌ - No puede funcionar si GET falla

🔬 Razones técnicas:
1. IDs inconsistentes
json-server puede generar IDs como strings ("afbd", "3828") en lugar de números (1, 2, 3), causando problemas en las rutas.
json// ❌ Incorrecto
{"id": "afbd", "title": "..."}

// ✅ Correcto
{"id": 1, "title": "..."}
2. Servidor Cloud Workstations mal configurado
Los servidores remotos pueden tener configuraciones que impiden el acceso a rutas individuales por CORS, proxy reverso o reglas de firewall.
3. json-server no reiniciado correctamente
Después de modificar db.json manualmente, json-server puede no recargar los datos correctamente.
✅ Soluciones propuestas:
Solución 1: Usar json-server localmente (RECOMENDADO)
bash# 1. Instalar json-server
npm install -g json-server

# 2. Crear db.json limpio
echo '{"tasks":[]}' > db.json

# 3. Iniciar servidor
json-server --watch db.json --port 3001 --host 0.0.0.0

# 4. Verificar en navegador
# http://localhost:3001/tasks/1 debe funcionar
Solución 2: Forzar IDs numéricos secuenciales
Modificar createTask en api.ts:
typescriptexport async function createTask(task) {
  const allTasks = await fetchTasks();
  const nextId = allTasks.length > 0 
    ? Math.max(...allTasks.map(t => t.id)) + 1 
    : 1;

  const res = await axios.post(`${API_URL}/tasks`, {
    id: nextId,  // ID secuencial: 1, 2, 3...
    ...task,
    done: false,
    createdAt: new Date().toISOString(),
  });
  return res.data;
}
Solución 3: Cambiar a PATCH en lugar de PUT
typescript// En api.ts
export async function updateTask(id: number, data: Partial<TaskDTO>) {
  const res = await axios.patch(`${API_URL}/tasks/${id}`, data);
  return res.data;
}
🧪 Cómo verificar si está resuelto:

Crear una tarea nueva
Abrir en navegador: http://localhost:3001/tasks/1
Si muestra la tarea → PUT funcionará ✅
Si muestra "Not Found" → Problema persiste ❌


🐛 Debugging
Logs útiles agregados:
typescript// En api.ts
console.log("🔍 UPDATE TASK");
console.log("URL:", `${API_URL}/tasks/${id}`);
console.log("ID:", id, "| Tipo:", typeof id);

// En TaskContext.tsx
console.log("🔍 CONTEXT - editTask");
console.log("ID recibido:", id);

// En TaskEdit.tsx
console.log("🔍 TASKEDIT - handleSave");
console.log("ID original:", id);
console.log("ID Number:", Number(id));
Verificar en Chrome DevTools:

Abrir Metro Bundler
Presionar j para abrir debugger
Ver logs en Console


📚 Recursos adicionales

Documentación de Axios
json-server en npm
Expo Router
Zod validation
React Native docs