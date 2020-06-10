<script>
//project Dex (Управление IoT умного дома)
function smrefresh() // обновление статуса устройств на основном экране
{
			$.ajax({ //jquery ajax для обмена с бэкэндом
				url: "https://<?echo $server.'/'.$page; ?>?smrefresh",  //php активно вмешивается в генерацию html и $server используется для подмены имени файла, чтобы запускать тесты не в продакшн
				cache: false,
				success:
					function(html){
						raw=html;
						arr=raw.split(','); // данные с сервера приходят в самодельном формате в виде строки, блоки в которой разделены запятыми. разделяем и делаем массив
						for (i = 0; i < arr.length; i++)
						{
							
							arr2=arr[i].split(':'); // в каждом блоке пакет значений. Превращаем еще в один массив. Я конечно знаком с json, мне хотелось велосипед
							id=arr2[0];
							stat='state'+id;
							if(arr2[1]==3)
								{status='<font color=#FF0000>Оффлайн</font>'; arr2[2]='offline';}
							else if(arr2[1]==2)
								{status='<font color=#FFFF00>Связь</font>';}
							else{status='<font color=#90EE90>Онлайн</font>';}
							// прописываем устройствам их новые визуальные свойства
							document.getElementById(stat).innerHTML=status;
							button='button'+id;
							document.getElementById(button).src='img/'+arr2[2]+'.png';
						
						}
						} 
				});
			$.ajax({ // запрос к серверу на обновление расширенных свойств текущего элемента
				url: "https://<?echo $server.'/'.$page; ?>?advrefresh", 
				cache: false,
				success:
					function(html){
									if(html!=0) // если в ответе 0 - значит ошибка. 
									{
										if(html=='net') // net - все отработало штатно, но дополнительные данные отсутствуют
										{
											document.getElementById('waiton').checked=false;
											document.getElementById("waiting").style.display = "none";
										}else{ // показываем блок дополнительных данных
										document.getElementById('waiting').innerHTML=html;
										document.getElementById("waiting").style.display = "block"; //включаем видимость блока
										document.getElementById('waiton').checked=true;}
									}
								  } 
				});								
}

function advanced(id) // функция вывода дополнительной информации при смене текущего устройства 
{
var tid='str'+id; // делаем id строки с устройством

			$.ajax({ 
				url: "https://<?echo $server.'/'.$page; ?>?laststr="+id, 
				cache: false,
				success:
					function(html){
						ltid='str'+html; // проверяем, было ли изменение
						if(ltid!=tid){
						document.getElementById(ltid).className = "devnoid"; //изменение было выключаем подсветку предыдущей строки
							}
						} 
				});		
document.getElementById(tid).className = "devid"; // подсвечиваем текущую строку

			$.ajax({ 
				url: "https://<?echo $server.'/'.$page; ?>?advanced="+id, 
				cache: false,
				success:
					function(html){
						//document.getElementById('advanced').style.display='block';
						document.getElementById('advanced').innerHTML=html;	// выводим полученную информацию в блок расширенных свойств
						} 
				});		
}

// project Golosmarket (голосовой портал)

function getaja(id) 
{
 /*
	Получение статуса уведомлений с сервера. Это опять не json велосипед. Работает в два запроса. 
	Первый показыватет тип уведомления, второй передает данные в зависимости от уточняющих запросов.
	Используется jquery
	так же используется js библиотека toastmessage для красивого вывода всплывающих уведомлений.
 */
	$.ajax({
		url: 'ajax.php/?getaja='+id,
		cache: false,
		success: 
		function(html){
		if(html =="2")
		{
			$.ajax({	
			url: 'ajax.php/?msgsendg='+id,
			cache: false,
			success: 
			function(html){
			showChatToast(html);	
			$('<audio id="chatAudio"><source src="files/tyndyn.ogg" type="audio/ogg"><source src="files/tyndyn.mp3" type="audio/mpeg"><source src="files/tyndyn.wav" type="audio/wav"></audio>').appendTo('body');
			$('#chatAudio')[0].play();
			}
			});			
		}			
		if(html =="4")
		{
		$.ajax({
			url: "ajax.php/?gor=0",
			cache: false,
			success: function(html){
			if(html !="0")
			{
				showChatToast('<center>Вам выставили счет... <a href="javascript:void(0)" onclick="openchatw2('+html+');"> Нажмите сюда</a></center>');
			}}
		});			

		}
		if(html =="5")
		{
		$.ajax({
			url: 'ajax.php/?gos=0',
			cache: false,
			success: function(html){
			if(html !="0")
			{
				showChatToast('<center>Изменилось состояние счета... <a href="javascript:void(0)" onclick="openchatw2('+html+');"> Нажмите сюда</a></center>');
			}}
		});			
		}

		if(html =="6")
		{
			showChatToast('Вас добавили в избранное...');
			}
		if(html =="7")
		{
			showChatToast('Вам написали отзыв...');
			}
			
		}

	
});	

</script>
