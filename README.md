#  💪 APP-Fitness

📦 El proyecto consiste en el desarrollo de una **plataforma web fitness** personalizada, orientada a usuarios que desean mejorar su condición física, reducir peso, ganar masa muscular o mantener un estilo de vida saludable. La aplicación mediante el **calculo del IMC** (Indice de masa corporal) del usuario puede ofrecer planes de alimentación y entrenamiento adaptados a las características de cada resultado, ofreciendo además un sistema de seguimiento visual y estadístico del progreso.

---

## 🎯 Características

- ✅ Mostrar gráficas dinámicas de evolución de peso, medidas corporales y rendimiento.
- ✅ Implementar un Dashboard donde se vea el registro del usuario.
- ✅ Implementar login y registro.
- ✅ Brindar informacion sobre el IMC.

---

## ⚙️ Instalación

1. Clonar el repositorio
2. Crear un entorno virtual en la ruta \backend:
   ```bash
   python -m venv venv
   ```

3. Activar el entorno virtual:
   ```bash
   # Windows
   .\.venv\Scripts\Activate.ps1
   
   # Linux/Mac
   source venv/bin/activate
   ```

4. Instalar dependencias:
   ```bash
   python -m pip install --upgrade pip
   ```
   ```bash
   pip install -r requirements.txt
   ```

6. Ejecutar migraciones:
   ```bash
   python manage.py migrate
   ```

7. Ejecuta el servidor backend:
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```
   
8. Instala dependencias en la ruta \frontend:
   ```bash
   npm install
   ```

9. Ejecuta el servidor frontend:
   ```bash
   npm run dev
   ```
   
---

## 💻 Tecnologias usadas

- React + Vite
- Python con Django
- Figma
- Django REST Framework 3.16.0

---
### 🔗 [Link del Figma](https://www.figma.com/design/YJAhbBXdtdZ3HoIn8lYnIO/andre-s-gym--Community-?node-id=207-280&p=f&t=Yene1gBiAeDlS6LW-0)
---