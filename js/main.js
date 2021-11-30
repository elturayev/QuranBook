let api =(`https://api.quran.sutanlab.id/surah`)
let prayerTimesApi = 'https://api.pray.zone/v2/times/today.json?city=Tashkent'

let bomdod = document.querySelector('.bomdod h3')
let quyosh = document.querySelector('.quyosh h3')
let peshin = document.querySelector('.peshin h3')
let asr = document.querySelector('.asr h3')
let shom = document.querySelector('.shom h3')
let xufton = document.querySelector('.xufton h3')
let input = document.querySelector('.input')
let date = document.querySelector('.date')
let allAudio = document.querySelector('.playAudio audio')
let audio = document.createElement('audio')
let audio1 = document.createElement('audio')
let many = 0

let list =document.querySelector('.list')
async function render(){
	let get = await fetch(api)
	return (await get.json())
}

async function timesPrayer(){
	let times = await fetch(prayerTimesApi,{
		method: 'GET'
	})
	let response =  (await times.json())
	bomdod.textContent =(response.results.datetime[0].times.Fajr).split(':')[0] + ':' + (((+(response.results.datetime[0].times.Fajr).split(':')[1] + 12)+'').padStart(2,0))
	quyosh.textContent = (response.results.datetime[0].times.Sunrise).split(':')[0] + ':' + (((+(response.results.datetime[0].times.Sunrise).split(':')[1] + 5)+'').padStart(2,0))
	peshin.textContent = response.results.datetime[0].times.Dhuhr
	asr.textContent = (+(response.results.datetime[0].times.Asr).split(':')[0] + 1) + ':' + (((+(response.results.datetime[0].times.Asr).split(':')[1] - 22)+'').padStart(2,0))
	shom.textContent = (response.results.datetime[0].times.Maghrib).split(':')[0] + ':' + (((+(response.results.datetime[0].times.Maghrib).split(':')[1] - 14)+'').padStart(2,0))
	xufton.textContent = (response.results.datetime[0].times.Isha).split(':')[0] + ':' + (((+(response.results.datetime[0].times.Isha).split(':')[1] - 11)+'').padStart(2,0))
	date.textContent = response.results.datetime[0].date.gregorian

}
timesPrayer()

let heading = document.querySelector('.heading')
async function geting(){
	let a = await render()
	input.onkeyup = (event)=>{
	if (!(event.keyCode == 13)) return
	if (+input.value > 114 || +(input.value) < 0){
		alert('Sura raqami (1 - 114) shu oraliqda kiriting!')
		input.value = null
	}
	allAudio.src = `http://aayahmedia.com/quranmp3/afasy/${(input.value).padStart(3,0)}-Mishary.mp3`
	let api2 =(`https://quranenc.com/api/translation/sura/uzbek_mansour/${input.value}`)
 	let music = api + '/' + input.value
	async function render1(){
		let seting = await fetch(api2)
		return await seting.json()
	}

	async function audiomp3(){
		let mus = await fetch(music)
		return await mus.json()
	}
	async function getting(){
		let b = await render1()
		let audioresponse = await audiomp3()
		let audios = audioresponse.data.verses
		list.innerHTML = null
		for (let j of b.result){
			if (input.value == j.sura){
				let li = document.createElement('li')
				let span =document.createElement('h3')
				let span1 =document.createElement('h3')
				span.textContent = j.arabic_text
				span1.textContent = j.translation
				li.append(span,span1)
				list.append(li)
				li.onclick = ()=>{
					allAudio.pause()
					audio.src = audios[j.aya - 1].audio.secondary[0]
					if (many == 0){
						audio.play()
						many +=1
					}
					else {
						musical(audios[j.aya - 1].audio.secondary[0])
					}
				}
			}
		}
		input.value = null
	}
	getting()
	for (let i of a.data){
		if (input.value == i.number)
			heading.textContent = input.value + '. ' + i.name.transliteration.id
		}
	}
}

function musical(link){
	audio.pause()
	audio.src = link
	audio.play()
	allAudio.pause()	
}

geting()
