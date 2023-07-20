# Generador de exámenes


## Descripción

Esta aplicación Full Stack está construida con un patrón de diseño MVC en todas sus capas, desde el cliente al servidor. Su objetivo principal es la generación de exámenes aleatorios a partir de preguntas tipo test almacenados en una base de datos con sus correspondientes respuestas. Estas preguntas están clasificadas por tema y dificultad y cada una de ellas tiene 4 opciones de respuesta, de las cuales solo una es verdadera.

Siguiendo la estructura en la base de datos, el usuario puede seleccionar los temas, la dificultad y el número de preguntas que quiere para su examen, con un máximo de 100 preguntas. Cuando se hace esta petición al microservicio (API Restful) que se encarga del filtrado de las preguntas y de su ordenación aleatoria para que los exámenes sean siempre diferentes, este devuelve un JSON que es interpretado por el Front-End para mostrarlo en pantalla de forma intuitiva y accesible.

Una vez que el examen está generado, el usuario puede resolverlo de forma online seleccionando la respuesta que considera correcta con unos radio button asociados a cada pregunta o bien puede descargar el examen formateado como HTML con extensión .odt a fin de poder ser modificado fácilmente por un procesador de textos tradicional e impreso para su solución en papel. Si se opta por la primera opción, la aplicación guardará los resultados de los exámenes en el Local Storage de cada usuario. En caso de optar por la opción de descarga, puede descargar asimismo una hoja de respuestas en formato .xlsx que facilita la posterior corrección por parte del examinador.

Por otra parte, se ofrece al usuario una interfaz completa para hacer un CRUD de las preguntas y respuestas de la base de datos mediante peticiones HTTP.

Finalmente, cabe destacar que la aplicación está completamente adaptada a todos los tipos de dispositivos con un diseño responsivo y teniendo en cuenta la accesibilidad para asegurar la igualdad de oportunidades en su uso.

### Front-End: Angular con Angular Material
### Back-End: NodeJS con Express
### Database: MySQL


