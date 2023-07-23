import React, { useState, useEffect, useRef } from 'react';
import { spotifyAxios, internalAxios } from '../components/HTTPintercept';
import mixpanel from 'mixpanel-browser';

export default function Home() {
    const [playlists, setPlaylists] = useState(null);
	const [inputValue, setInputValue] = useState('');
	const [topWordSongs, setTopWordSongs] = useState({});
	const [tooLong, setTooLong] = useState(false);
	const [generating, setGenerating] = useState(false);
	const [showPremium, setShowPremium] = useState(false);
	const [premium, setPremium] = useState(false);
	const [premiumFail, setPremiumFail] = useState(false);
	const [premiumSuccess, setPremiumSuccess] = useState(false);

	const isFirstRender = useRef(true)
	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}
		mixpanel.track_pageview();
	}, [])

	const handleChange = (event) => {
		event.preventDefault();
		setInputValue(event.target.value);
		if(event.target.value.length > 30 && !premium){
			setShowPremium(true);
			mixpanel.track('Premium Upsell Seen');
		}
	}
	
	const premiumFailClick = (event) => {
		mixpanel.track('Premium Fail Click');
		setPremiumFail(true);
	}
	const premiumSuccessClick = (event) => {
		mixpanel.track('Premium Success Click');
		setPremiumSuccess(true);
		setPremium(true);
		localStorage.setItem("premium", true);
	}
	const closePremiumDialog = (event) => {
		mixpanel.track('Premium Upsell Close');
		setShowPremium(false);
	}

	const submitSearch = async (event) => {
		event.preventDefault();
		let generations = localStorage.getItem("generations");
		if(generations == null){
			generations = 0;
		}
		if (inputValue.length > 0 && inputValue.length < 200 && !generating && generations < 5) {
			mixpanel.track('Generate Playlist', {"input" : inputValue, "length" : inputValue.length });

			generations++;
			localStorage.setItem("generations", generations);
			setGenerating(true);
			let wordsArray = inputValue.split(" ");//match(/\b(\w+)\b/g); //.filter(function(num) { return num != '' }).length;
			// Remove last element if it is empty – if someone pastes in spaces at the end
			console.log(wordsArray);
			for(let i = 0; i < wordsArray.length; i++){
				if(wordsArray[i] == ""){
					wordsArray.splice(i, 1);
					i = i - 1;
				}
			}
			if(wordsArray.length < 30){
				let playlistTracks = [];
				let i = 0;
				let batchSize = 3;
				while(i < wordsArray.length){
					if(i + batchSize > wordsArray.length){
						let size = wordsArray.length - i;
					}
					let hit = await queryWords(wordsArray.slice(i, i + batchSize));
					if(hit.size > 0){
						playlistTracks.push(hit.track);
						i = i + hit.size;
					} else {
						i++;
					}
				}
				console.log("=== Final tracks ===");
				console.log(playlistTracks);
				let playlistId = await createPlaylistAPI(inputValue);
				let playlist = await addToPlaylistAPI(playlistTracks, playlistId);
				window.location.href = '/playlist/' + playlistId;
			}
		}
		else{
			setTooLong(true);
			mixpanel.track('Generate Playlist too long', { "length" : inputValue.length });
		}
	}


	const queryWords = async (words) => {
		let topWordSongsWithUris = {"a": "spotify:track:3fbyi27jxfkyk4hl1nslei","ability": "spotify:track:1SrqQnYaHh2vM5yhFL6k4n","able": "spotify:track:0K07tPZD4kqxiOJz6yYo6M","about": "spotify:track:3AxUzLrpYZYL2xkediA6Kq","above": "spotify:track:3Zqxv8C4ptJStELYI0rkXM","accept": "spotify:track:3ME1urQDMipf37SObnNsS6","according": "spotify:track:3FMnT1q5aZTFOmA77DRQMc","account": "spotify:track:1rGiDKgBG2UGh5itfoi9pk","across": "spotify:track:7CO5O9Tc5Ad7z8IQkuzmIS","act": "spotify:track:3oQtwxw1h4DKYe5eCMMt04","action": "spotify:track:68GToPSpR8CxZ14BlO0ljT","activity": "spotify:track:0IIOwu4rGxl7iXpP91QdzL","actually": "spotify:track:41HCdnT9qzSXtSmgU6p1SF","address": "spotify:track:7Mc6hytnyFDaAZBly5bO9b","add": "spotify:track:7DPhtBtUPDdUjn6DWP2Bjf","administration": "spotify:track:7yR0aPeIRbVhwQFtGTJvs1","admit": "spotify:track:10lZ6tQl1svBPwHNXwoNlW","adult": "spotify:track:1orKNWYlGLs3EofDZCGY5s","affect": "spotify:track:2AjQvEoxWovHMzRlThN5fu","again": "spotify:track:4oqq1bcp12gqqxjnupxqfr","after": "spotify:track:613xaFUWjgLAzYx2P51FU5","against": "spotify:track:3vn7GIrz9res0XoBISOxnO","age": "spotify:track:1Vyt2ayOEzyp22tF2USYp0","agency": "spotify:track:5l3hRaDq24lvxuBNkU4krp","agent": "spotify:track:5PIV5KfnOb3vUwIrofQZUh","ago": "spotify:track:6rvjamMH6zr1FTBp56XCd7","agree": "spotify:track:21SN7KNZjN45C8CrEJOhQy","agreement": "spotify:track:6dAciW8zYWlJOntQ4RNiaA","ahead": "spotify:track:6ZPHdT3dfoiBZeOEHeekWc","air": "spotify:track:6ZHI61XwO5da8k001KL8nO","all": "spotify:track:2m2n68ogwqxt2aecmplqqo","allow": "spotify:track:1t7fuovEXYKxa3zcdgQV1h","almost": "spotify:track:6TclVCUxDQm9s3Bey6Ao8H","alone": "spotify:track:3MEYFivt6bilQ9q9mFWZ4g","along": "spotify:track:7F7dceF1rK4iZB7oqfdWwV","already": "spotify:track:7tA28akUmNvROE7xKgWCCh","also": "spotify:track:1IQV2zpUoQc11xfgwwEFkT","although": "spotify:track:36r16aESWAuPKt41IMMFi0","always": "spotify:track:4lsGBZWdjhnLBLY8Xp38g0","American": "spotify:track:0Tem3UhyVIYeKDUcSN0E3j","among": "spotify:track:6RB4kM9j9y3SB76dLvE6HA","amount": "spotify:track:6MyvkgkjD6WZxgyBwyWEAs","analysis": "spotify:track:4bkOrTVM5nV5lr5lJCSgkf","and": "spotify:track:5ItObrwDx2uOtdEEndtNLl","animal": "spotify:track:0Isd8EoxYMKf91gezPn9Rk","another": null,"answer": "spotify:track:09eSdS5RTgyodJt3krr5AC","any": "spotify:track:5S7kMbtEikXwCAHMu3R3jw","anyone": "spotify:track:7DNM5E7QCOLbSl6Ri6HsA5","anything": "spotify:track:4ssz7wb04klYX6Bo9aMur9","appear": "spotify:track:7mlrvoq4OmaBzY8xisyPDu","apply": "spotify:track:5SkjTqQiVbzZozJDJ29dth","approach": "spotify:track:7zBUm2veYKK10MjuU5U0I8","area": "spotify:track:7fJozqj7NMdvo0zkcXDbgg","argue": "spotify:track:3DrzeqjTR3O9zCBdeSRoYu","around": null,"arm": "spotify:track:3ns5h6D0hpXXH6YeNNpf5P","arrive": "spotify:track:5g2cNagikgtQVyE05ZdQaS","art": "spotify:track:5tQs6lsPw4E6Ids6b8W5uZ","article": "spotify:track:455mdPOLhTQSLnaYzqRtAz","artist": "spotify:track:0ojlu3t1HJDLKAUVjdLqIP","as": "spotify:track:3ymWphd2NujUdjfEy83Ksp","ask": null,"assume": "spotify:track:4N4r4lpT9ta8nGpd8I57Ek","at": "spotify:track:3CY6MeSyVXO0B9aQHIUbjH","attack": "spotify:track:2FR4v9gFTqcY95qE8TahcF","attention": "spotify:track:6wKC8VQaVd9BMBuwE777Xg","attorney": "spotify:track:2SGbjuWRBXcV8kJcbtTAu6","audience": "spotify:track:7zVmdcwKhG4ED3WBrpH1jF","author": "spotify:track:6V6Nk6D4KKSQCWdHpJ23qp","authority": "spotify:track:1CwrPSUEPXNvlYTKRhPFUo","avoid": "spotify:track:7BlzpOsE5uzJMHkvfnYNA8","available": "spotify:track:1b6tPXXCV2fSNtR3SKWUQA","baby": null,"away": "spotify:track:1wfIqsTXmMVtZxYk8uWxGa","back": null,"bad": null,"bag": "spotify:track:0Jr5BK0uUlYPN1aWp523zg","ball": "spotify:track:3CL4OEx96xE6eO9vrHunJY","bar": "spotify:track:6yEhSfiMCHSbFDP7vElDZE","bank": "spotify:track:0uqJQ1k1N63nl4tAYW8t2A","base": "spotify:track:4zEoFeOxxS05gkp8KCWXlr","be": "spotify:track:7h2T6Og9aVzhiD9yq72bpc","beat": "spotify:track:2OEa4ONVAjI6fyBbVw7YY2","beautiful": "spotify:track:5sI32gXLd8w5esSyI1xSGg","because": "spotify:track:2VRNkdYbYUAOAcw71IqPBx","become": "spotify:track:1K0YmYdjfrI8Xghldf1hx7","bed": "spotify:track:1BiLJCywa23gfItfszweXm","before": "spotify:track:5xBCH6WLclZ9iQmAQtOfam","begin": "spotify:track:4aGdcD22blnSnTGjGJHyET","behavior": "spotify:track:7MtmLhbyAUEEdGZltsNQoh","behind": "spotify:track:15oVMUlDHfS06PLajkMHXH","believe": "spotify:track:0mh3kdiViRyeH8JzVL61Hw","benefit": "spotify:track:5VfrTilnp4RRJCn4VJyfHr","best": null,"better": "spotify:track:6zeeWid2sgw4lap2jV61PZ","between": "spotify:track:1BReY8IHV7Efwyn1N86Ix7","beyond": "spotify:track:3O0AJgcxfdAEukieZqtlQI","big": null,"bill": "spotify:track:6eDTGnJdupftZ9qdEOyjAJ","billion": "spotify:track:45UwVg384kT7GOgAQixr43","bit": "spotify:track:6UaUkWcGyVvZRdg0LgyFlq","black": null,"blood": null,"blue": null,"board": "spotify:track:49AeUY9XI8OTSAhSs71zRR","body": null,"book": "spotify:track:5bvR6HZsnbDPs1dGeuc0Vg","born": "spotify:track:2Fg4YvJxXKPcjO7S0M2xxo","both": "spotify:track:1VZXhaEAeKUaSwUSocl2qp","boy": null,"box": "spotify:track:7qGsZBxpEAnPWH6nt3FEXU","break": "spotify:track:4urxRqBRiaH0i20OKBsgxc","bring": "spotify:track:5GjA0Zw30djBxmBOsmuONG","brother": null,"budget": "spotify:track:5zG0aCkJGKcKnpqLghrAoE","build": "spotify:track:4TMpYSrYdw9MsgBpbnOqva","building": "spotify:track:3sdx3HUH2Bm3QmVlivhjLQ","business": "spotify:track:3PT1quIkL13ZpGNyE7Vyqz","but": "spotify:track:51Efm2ZRVTRYXU3hqUPN2r","by": "spotify:track:2orm0kdkhrbrkqsyfy6n5f","buy": null,"call": "spotify:track:6NCGz1TekGAlg3D5nIgBcc","camera": "spotify:track:4RxrYNCd05rMNkbF2wQZ2u","campaign": "spotify:track:1EWaLaSBO1SeEk3B17eVOL","can": null,"cancer": "spotify:track:0OKyHCaucID63z1EKxiE65","candidate": "spotify:track:209Jaj4ILewUqUOz7x8cFj","capital": "spotify:track:4e8LCMIhsUDNBJKsD50EGW","car": "spotify:track:4qqM11dV7X9CFjSbbgRdZJ","care": "spotify:track:6yVifGwfcKbuRKRd7XUURH","card": "spotify:track:5yMIMegCazarUszbhK8BjE","career": "spotify:track:3DMkY7L3TYUVkCLkrVKI2K","carry": "spotify:track:7pREfLcES5r76P0NtPdZXk","case": "spotify:track:5HqngsF3BE19077Ilnw7N5","catch": "spotify:track:2aJ6PwdTLJRhOMX7KIySvv","cause": "spotify:track:1oDDf6n4dBT69bPlriu1eO","cell": "spotify:track:7doyvd1nslbr6vipa2at07","center": "spotify:track:71byapfMhoBKxc2Dvv45by","central": "spotify:track:6qaHZnDK1r9OHM2udFhzzd","century": "spotify:track:7DRtbP5IzYchO6FAGb3u91","certain": "spotify:track:5AXpRpPhjlAbylEKmU1P1U","certainly": "spotify:track:5wypW8HvTXHNvZfqLhvPpj","chair": "spotify:track:2vg5pn42uySj4L1D8OTMv4","challenge": "spotify:track:1SiHjdhvDlsKVlUQg4ZWv0","chance": "spotify:track:6V6JqtUEy5SMKTRVX1ZGkf","change": "spotify:track:2xqfPS1VOPkH8rdKy2tIQe","character": "spotify:track:763MxZb0DDlegTljHYw2N2","charge": "spotify:track:49QD0TC24UAdUzRrcLs7ud","check": "spotify:track:06SEmgRU2kQYXWNh3xhrmr","child": "spotify:track:5HaYRuf3zAfCb8RSO9LLea","choice": "spotify:track:05mwx0D4hssehvqKLTEo65","church": "spotify:track:0MzO0c9Lr1d4mTUQtGhSJX","choose": "spotify:track:0bSLDuIIIGla6l9C9DIXqP","citizen": "spotify:track:2OezgBTkkaMfwfCYCBzMip","city": "spotify:track:2SCM41M2pe6PF6eASyVWyy","civil": "spotify:track:4RKl7loA2w8AwcsVhq1lYk","claim": "spotify:track:3aMOh1cxozykq54NNA7xfv","class": "spotify:track:3ooxgeVobZPaGQnktpdIZc","clear": "spotify:track:4aVba497OPVMCOTNaUZa9w","clearly": "spotify:track:5XBqGcLYOZi8CEW83Ug7Fs","close": "spotify:track:3lSDIJ2abCrOdDJ6pshUap","coach": "spotify:track:3QaCNWSZnTy0aIvflwTUA5","cold": null,"collection": "spotify:track:7nNnJFyjTQbdVxPT3kPS3U","college": "spotify:track:6hsI1ar1EIyXU28ZHWlNW6","color": "spotify:track:09ficUB5QJ3RzJW04hM6g2","come": null,"commercial": "spotify:track:5d2lXl6KFVeSeqaC3IpJVl","common": "spotify:track:3UpinTAjymA4yOog7dEQ1Q","community": "spotify:track:49L13iy30mE0SJ8WnThTTX","company": "spotify:track:50Yshk0rUfkw0Pw5QH1sgk","compare": "spotify:track:1mZoY2KmZ5gcJl8VTVwg93","computer": "spotify:track:6yovEvjfyTHfyP5VNXlcwp","concern": "spotify:track:4p9JqZ4kyzXvakuhouR4jJ","condition": "spotify:track:58uCZXMwMLpce5faHrKadP","conference": "spotify:track:6odJqZtq8slAE0noBhIygt","Congress": "spotify:track:4QEnR7xjZo6AN4Y9F4YTnP","consider": "spotify:track:04KjAytkGtBGayr2GdCE1V","consumer": "spotify:track:7xTyyUMG6fb6XRAKr2NTQs","contain": "spotify:track:0PdR5ZhCvFKIphdQsAmZQl","control": "spotify:track:1tPknWGSEpsR3eJLcxozU0","continue": "spotify:track:7aGH4Sswx1sY4ATXwJm1ty","cost": "spotify:track:2Y5z1RBaBIMprXzxNXi4lk","could": "spotify:track:3WhoPKUNBJbKnTGaJqQTDP","country": "spotify:track:7jflS8W4TFqxDk6OlFPazd","course": "spotify:track:7cJPlzmQ2jiEmrbmPMGYBu","couple": "spotify:track:6mtly6X3N0F6P3qq5JAvU9","court": "spotify:track:3NDzehVVhrIMPWGz1bNFWV","cover": "spotify:track:22oh5aFTW2Y3RvuI8RMFHf","create": "spotify:track:5q8fyv7VvMfGtlAJ6PaNW1","crime": "spotify:track:5LYKgAbpT26VRwrbGWd3jR","cultural": "spotify:track:7MdwFGZY6e5sdPtKpMOM2d","culture": "spotify:track:3ahLWfMX7smqSJgJsnQkgE","cup": "spotify:track:2T6WB572SyexDJSTL2dCsy","current": "spotify:track:5GNYArYpc0SndVcY5icLkY","customer": "spotify:track:5POojsjVDfkIGU9S7uRPHg","cut": "spotify:track:5etwEoBPKaYyqjls8R2StC","dark": "spotify:track:4njK1KqRB9h6V4rrgyAcIM","data": "spotify:track:3IeWzsCPXC0Q32mMoJq73c","daughter": "spotify:track:78Gj13Jr6kFnwBgIFkOFXl","day": null,"dead": "spotify:track:7yv8vNPzIEYFqsO9eHm4Uz","deal": "spotify:track:47J2U4dM6ArEhZmc3BiH1w","death": "spotify:track:10SnJf1bmseurRqpYNYQno","debate": "spotify:track:5Y8lu5v26hIzKEMt55Anp3","decade": "spotify:track:0VS55lllaFoyAmGJPN6dMe","decide": "spotify:track:6nTkuZVtaU8bCLCrnVqJY7","deep": null,"decision": "spotify:track:2LNS489RB6StbTWZiypZRR","defense": "spotify:track:4sT5MZS6EsjAfNisiCHOjP","degree": "spotify:track:07PfKHJfsxCTGhsBjW4Lgb","Democrat": "spotify:track:1sfYIlTr7wjoWxnMEcKNZz","democratic": "spotify:track:60YfG1521QiYFQ75nThMqW","describe": "spotify:track:508nY373gqWT9A7eRx2Owl","design": "spotify:track:2BXfY1o4ecSnwkAuWXqXYL","despite": "spotify:track:5zdVd801u8le2ptbwLdL8q","detail": "spotify:track:0ThhiWxiBxx2fQzuQsPXKt","determine": "spotify:track:3CHOnOtTwT1jSGHfVONw3O","develop": "spotify:track:75B3yK3MNd9FaOR3IVrZRP","development": "spotify:track:16ESDQEMytzguWDoqYwmqv","die": null,"difference": "spotify:track:7uaj8P84SARGXvhTQy5XD7","different": "spotify:track:0vJBL4Dx9aVFsHSqdApU3H","difficult": "spotify:track:7llBR7Fy7Fw9zgEQuZp6K7","dinner": "spotify:track:4FYpaqcnY0rM886pw6nDB0","direction": "spotify:track:7qj1ijrHzwPZEhBDHCxuKg","director": "spotify:track:6Yx9IiU5nvbE8H8it5XhFj","discover": "spotify:track:6lv5DC1Iy7MxFWdiMoAEx4","discuss": "spotify:track:7GhL30GAwZSrixP7nfBg5R","discussion": "spotify:track:1N0VXvVxSoMp66StV03Opo","do": null,"disease": "spotify:track:3POcdaiPYoL4peuFyKWRJE","doctor": null,"dog": null,"down": null,"door": "spotify:track:5YIVVzQcJG7pFhyNo0Ytlh","draw": "spotify:track:5L1Dkb5c8Im9rhkfVIJp3R","dream": null,"drive": "spotify:track:2T1Ewp4z88RBD7gS5VYZc1","drop": "spotify:track:5iscY6uoraOqqKurX7G8S9","drug": null,"during": "spotify:track:4jFzfAtbuGIJ9vJRrKJqhq","each": null,"early": "spotify:track:16GmGaaMDz4IAYDsasxsOU","east": "spotify:track:7uNn3pU7PGiyfg9P0pSzAv","easy": "spotify:track:1JQ6Xm1JrvHfvAqhl5pwaA","economic": null,"eat": "spotify:track:7LniD3cBTWpOzENmJuvMZb","economy": "spotify:track:6yMuQd38Kd604JiMe39xtV","edge": "spotify:track:478zKvO5SlAMJ1dNSn9Dcu","education": "spotify:track:1Sz6Ba3y5s7O2LK4KqoIr6","effect": "spotify:track:6lbE3dRfqjeb8JNMSHaSfo","effort": "spotify:track:7psuJ34tIkm9MTPMeBwn0o","eight": "spotify:track:5T2KxDbS2NXdQOzvNUO8UQ","either": "spotify:track:6QpqGSRmUnH81iYd1bfYL9","election": "spotify:track:6nIISQorRgZlMSxoN4g4a8","else": "spotify:track:1SqIUmKbeRyHwgp8BOBIRr","employee": "spotify:track:0OsQrld0oLHWhMgL0fL2FB","end": "spotify:track:77dW4ipF1TeznUkcS0Ha6Q","energy": "spotify:track:2fTI7WyN8F84C5j3Ltm65r","enjoy": "spotify:track:3NRXAXjsZGEndFAMD9PaCn","enough": null,"entire": "spotify:track:1HBXcqYe8yDsMHhLiblIbI","enter": "spotify:track:7jZP4Mg5mOY2Cn9OJgHtS5","environment": "spotify:track:3QcY4t0w7yHlCh6FiuEx5Z","environmental": "spotify:track:1ed5WmfiUnqBmUGnefgdjK","especially": "spotify:track:6bcOhTYJ1AqsEvAiWbQuDh","establish": "spotify:track:4Ix619FeQWZrQSrvpwY3lw","even": null,"evening": "spotify:track:1Enf3A3xjykEpPvBOlH5zg","event": "spotify:track:2hPAvvC3rlfWkwnaGZdRgE","ever": null,"every": "spotify:track:2YefQXYuQblKMnWdnQM4aM","everybody": "spotify:track:05DVUfw3ExNR8JtTaeiAXy","everyone": "spotify:track:7BxzDfNz645XSXHFPYyZrm","everything": null,"evidence": "spotify:track:7xqQtHLkKKyMa5T6777OVg","exactly": "spotify:track:0ptwFhDIqdIyXN0WsvIvji","example": "spotify:track:56oJMDs7YbXpO0daejxpIx","executive": "spotify:track:4bmUWnZ40AvP72hD0edQA1","exist": "spotify:track:4ERcdh4x2E44V9ju8vU8sc","experience": "spotify:track:0IFloxttNiiActLjNonDHh","expect": "spotify:track:1fpiuGtPQZijDV6Xrf7j28","expert": "spotify:track:44suWWgq5TfyZ52wPVLuHi","explain": "spotify:track:5xRxV9EFFIdbNgdVdkeQaP","eye": null,"face": null,"fact": "spotify:track:69bclrZL4qFevDVQY3wptK","factor": "spotify:track:4c4C73yEhBSuDguaahdjqN","fail": "spotify:track:0zD93qdDeQ7XFAAtyYM8bk","fall": "spotify:track:0Jv1rSowST5W9X7yuZmSEE","family": "spotify:track:0FKvAS83dald2ZWuyTr7Dz","far": null,"fast": "spotify:track:02cL6KknnISiigB7U3Cy82","father": "spotify:track:7kGb8gY1YY7bfJrlj682nX","fear": "spotify:track:3KJUiEOuhS9OS7i0UI6iue","federal": "spotify:track:2VxPpDkM7HU2jcU4Z8P5wj","feel": "spotify:track:6j6hFfwf57BAscKhaVq133","feeling": "spotify:track:42qGXI8aLfzz3nAl7xy7Sl","field": "spotify:track:0AX6lpjMNVkuzcLRCS6FbF","few": "spotify:track:7uLwKuvcmdToYANAXhPGeO","fight": null,"figure": "spotify:track:4vopLoysFwDrQUtoDZcQqn","fill": null,"film": "spotify:track:0sWeV0ChKPi3XovErkuTnr","final": "spotify:track:6mhaWif8Xzkkqs0ijbQIls","finally": "spotify:track:07cIRfyX5Exfr8fVoytVbr","financial": "spotify:track:2IDOsNjlsuFVZCjAmYF3xM","fine": null,"find": null,"finger": "spotify:track:2Ze7hmkaF86O5EqdVXt8ZK","finish": "spotify:track:4qwPM5DF76oRREicIIQHqr","fire": null,"firm": "spotify:track:4Lh1ZfTqFJ4kAvd1fRdMtH","first": null,"fish": "spotify:track:2fUZvhKWwK7v4jTUmvTRPi","five": "spotify:track:4hguHlsIo1Zm0Rf6rXc06V","floor": "spotify:track:1DR8UGgruLFKgPvqtNZcTH","fly": null,"focus": "spotify:track:56mCGN7S1druROilPGNe3R","follow": "spotify:track:6aIUmQbPNjzsX3fRJTOPlP","food": "spotify:track:1fL3oiFKzuo7Yic2i9CGIj","foot": "spotify:track:0gpsFDKPu2U8AsEQLcDK8e","for": "spotify:track:5QRhWPoaejr45PerJ4cpeI","force": "spotify:track:19unD7rG2TiZExkGw7arDQ","foreign": "spotify:track:0tyYpW6eJ2q7Dtfyc3v7rO","forget": "spotify:track:26xgfuQnTaa5UQJhdQACz6","form": "spotify:track:0kWqU7NkUOXARwVn6cagwq","former": "spotify:track:1Z1e1yx0dVZXkD9M2qUNPd","forward": "spotify:track:2ay5cmmedtoJn2i8zf6ezi","four": "spotify:track:2gJiFABx8j3imZBgk2Flr1","free": "spotify:track:1OBK456H4lf7g4Zc6LopNr","friend": "spotify:track:6fGSHpEipD1YjtLLChnBzW","from": null,"front": "spotify:track:0gtAguNPDQ7JzK7HzYcUez","full": "spotify:track:28W6HIslX4ewREVRiMfGrS","fund": "spotify:track:2zsWUr91K3TIdnzWb0XOmI","future": "spotify:track:79Vi8LIc885JnwTXuYJjfB","game": "spotify:track:7dUHHxrPLxzugX8fx5i8Bl","garden": "spotify:track:18RAcbwi6NAeHbeFaufyAE","gas": "spotify:track:7FJNM5i0qKjFfCtw18QVAU","general": "spotify:track:2f1iINWx7S1KIkFCxluYqZ","generation": "spotify:track:3aIAdDicHNTZXwAssrmIFa","get": "spotify:track:00WLU3yS97ylohkNCu3dZE","girl": "spotify:track:0pGXe7umwkcCm01Ipoxp0U","give": "spotify:track:1LzRiE4LCTF80qZectiltH","glass": "spotify:track:3nzaUvtZU2LBaf0aNZThmD","go": null,"goal": "spotify:track:37CornDOmVF85qDrmDYD01","good": null,"government": "spotify:track:1NDUEkeLjkgtAnpAnBhcgA","great": "spotify:track:5TegG9lN6ydHHmhlRNBshE","green": null,"ground": "spotify:track:2N977oXVcbzWqT4m3U698h","group": "spotify:track:7HHulHfYOPs9lqcDc9xWxt","grow": "spotify:track:7vn3J5Io100bjDdKaW4Aw2","growth": "spotify:track:2LjhubW8QWfSL6qsinSytS","guess": "spotify:track:1muo2VWqEWU2HQAAgI7f9Q","gun": "spotify:track:3t8uFsxO5knbxyR8OWK7k5","guy": "spotify:track:5L8CWOVWcQs66g5HLHflkx","hair": "spotify:track:4RLhdwclHWmNNB6rdkB8Zf","half": "spotify:track:0obWji31zliQB3k6iwKCoW","hand": null,"hang": "spotify:track:4nAk5rTFqrGcoAXLP2ppUl","happen": "spotify:track:1a7eiuu78V3YWGOKyOMOhD","happy": null,"hard": "spotify:track:1vOX5ChU2j6s1rz5UtzU8e","have": "spotify:track:0pyAy4tsrYwzeUd7xqGocd","he": "spotify:track:2VDbddQVoU2C3flwGsMy1g","head": "spotify:track:4ebJyRDcExeGnM3kPr061Z","health": "spotify:track:2VTQvzjZeVj26EJsVIs6Hh","hear": "spotify:track:2HSIQ7WI8LQC5ozwE8nRGM","heart": null,"heavy": "spotify:track:0hq2nau5DocCq4F1jexSJe","heat": "spotify:track:5MJX5jpQOUR88vJimDZbut","help": "spotify:track:0nGyHJfuNr1a24tULIdd6m","her": "spotify:track:4lScS6DCNR2LEEidKZALJ0","here": "spotify:track:0mO9DhAbNcSxvPC2lXqD1f","herself": "spotify:track:7EUTaR9VT8SAutpY18Tsbe","high": "spotify:track:32r9zA6SW29fIUOnZUt0Cq","him": "spotify:track:3AFPGvRzeKeNJbIbLwcz4G","himself": "spotify:track:14pago8d1Qj7Gz11fEcuwp","his": "spotify:track:4bJ0ZVBeQXX4nqFKQ3B97e","history": "spotify:track:0HMjXBAZmSYOTTi33WpMso","hit": "spotify:track:0jOODviJg2yfQr31c9NSJ8","home": null,"hold": null,"hope": "spotify:track:425haqCcybVDHI4vDIUOC4","hospital": "spotify:track:2bt1cEwiLzcClL5bTs0ezd","hot": null,"hotel": "spotify:track:3xyr2xfbSZiZWWGsjLyMFh","hour": "spotify:track:5XsmTdwrwdo0OLHJmm2ffG","house": "spotify:track:1NEgw4syq5vSzYOlxHEyTA","how": "spotify:track:5CLMG0eAitcBauIR8zPukZ","however": "spotify:track:4uiKBlHhfptl8e3MVDwo68","huge": "spotify:track:5hcfpG06NoWfaBjzhn6sjb","human": "spotify:track:0itAa5AgZsNscVF37FsOUX","hundred": "spotify:track:4zg9mLtIr9U9IfMymQz5iC","husband": "spotify:track:4gfqN4QyLVcDjhE7GGkf7d","idea": "spotify:track:2dv6nCgjGc1hp3jPBWXbIV","identify": "spotify:track:68ayhpLqyto5ZRjQRHWIWZ","if": "spotify:track:0t414ewhjciiupvf3qecz2","image": "spotify:track:3GlAkm1jaoH2dGoxZsDbkI","imagine": "spotify:track:6uz4Yo14VYYldoZRwFQhul","impact": "spotify:track:0KkxFgOH2iAoRWozZ5t87G","important": "spotify:track:2BTZGsvz9z0O5qCYz60494","improve": "spotify:track:70e6Fv9HUnUpFKVw7A9ywY","include": "spotify:track:3nKHkkaiSl9gu1IJDLV3wR","in": "spotify:track:7g2djA8bF6YlfWJl3GDTgL","including": "spotify:track:7kW9yFFa0XNWUTnrphvSf3","increase": "spotify:track:2mQANMsWTKpSvrG5k6hlsB","indeed": "spotify:track:71ssTgF9CBwbij5KBjzyXT","indicate": "spotify:track:7D8FObvhT4xSWUDfq6tUIa","individual": "spotify:track:7vRcKpigO1Hlel8HqRDz1K","industry": "spotify:track:0hpuGszpLZRFs8oe1XYMnJ","information": "spotify:track:5hOA9pN3s4p1w3ARgU8HWx","inside": "spotify:track:06K2jnwUZEMPcpourZqU6J","instead": "spotify:track:0j5lDMIy0cA0eh5Q2xxQwx","institution": "spotify:track:7hVhiOV3ucOLVJ8ZGU05pm","interest": "spotify:track:1bjLADJaVzlCuJzk3o525l","interesting": "spotify:track:0CVAue7xZB5sYl7LUPbxRe","international": "spotify:track:4ZREqhj35FKBhy4vjjWyOu","interview": "spotify:track:3EH4OrDntqbOmknacF0GQg","into": "spotify:track:06Cb1rajweHjGYCJaRcxDG","investment": "spotify:track:3yi5g2aJUuIMMFFAvelHE6","involve": "spotify:track:0puNPHR3uovorKlJW2lXMj","issue": "spotify:track:3whqQOYrraXDVZGZ7pMOVg","it": "spotify:track:3YvsmzphWvlJrrudjoEqS0","item": "spotify:track:1EWTsgQAEsUrnQ8iawhDSN","its": "spotify:track:01y5xsyy8bfd7quajr4flu","itself": "spotify:track:0mArpGUzb1oOvhEopzegom","job": "spotify:track:6Qtx99t4BfP0vX37Tvr0eG","join": null,"just": "spotify:track:1dyTcli07c77mtQK3ahUZR","keep": null,"key": "spotify:track:7K7E7LKK51PezScgsvVg9Y","kill": null,"kid": "spotify:track:24TzmWrz2HHWV3UO5PlvNb","kind": "spotify:track:7GVZHomUQIc2i8UukX343H","know": "spotify:track:3Aqn4N4Cignxiz5TS5kOq7","knowledge": "spotify:track:7FESZwlELNBsQSbqcXfQSZ","land": "spotify:track:01tGXEqfkBILf42ctnEAwz","language": "spotify:track:6hrUiH2R3ZLzCytQdjNH9u","large": "spotify:track:5ZgdLp0kodtEe4fYEtwnO9","last": null,"late": "spotify:track:3ZzxvVKoSIZSlVK9eyQEJp","later": "spotify:track:3Q9XfNrJQoaotR3rO1nKH5","laugh": "spotify:track:21R5MzmCwVspgN7uTh37f9","law": "spotify:track:0wChAVOTvlY0EMZhr4625f","lay": null,"lawyer": "spotify:track:65SKHwyUHl6gaCaZ4IC6VB","lead": "spotify:track:7CruOP0XJkw3oFLYVjtf86","leader": "spotify:track:30h3zPCNg7kHu5LmqEdtUj","learn": "spotify:track:7IWyEHTThWLeGBbVRRpnIx","least": "spotify:track:5CM7ECuEoaoDPc4uQu5r2w","leave": "spotify:track:1cRUfsueZVbar6cBZdN61r","left": "spotify:track:4GCMRjOax3Cp99TVz0KU9W","leg": "spotify:track:1I84C4pCw6l1ZyHGP1fC6k","legal": "spotify:track:4l7BGh2lDdApNmgFoFgOuH","less": "spotify:track:6zutxBTL3zMvI2TrpLWSxF","let": null,"letter": "spotify:track:5PBbpJVbkUnqeDU1zXugJW","level": "spotify:track:1SVWV3JrsvHs2FZHbM0jMV","lie": null,"life": null,"light": "spotify:track:3pQULN6HaJsITECQHV2FIp","like": "spotify:track:3m8Ew9YTs7cmr8nTrmdpFX","likely": "spotify:track:3iLfikDlZyS8wmq2xbfNoX","line": "spotify:track:68qrGP3wEb7W2jmHxAU4NJ","list": "spotify:track:4Orjp9XShhlWCVQsnTS4Nv","listen": "spotify:track:5CwdsBiSamf6csy5ICuTSr","little": null,"live": null,"long": null,"local": "spotify:track:65s2snYBFe2YeKIvZQvbvR","look": "spotify:track:4cdGkdcOnyOIfA1fnSuao5","lose": "spotify:track:1NURgUg2lzM1V5WaNiWZXU","loss": "spotify:track:2Xl9UQe1ZfJzLxEUsMwisI","lot": "spotify:track:7iEC0Jl5gaFqelasDhpPkT","love": "spotify:track:2kerz9h9iejzeipjhdjoyg","low": "spotify:track:2GAhgAjOhEmItWLfgisyOn","machine": "spotify:track:4uGY9CqDtGtaTTLg1cgsWD","magazine": "spotify:track:5dNqUYN9WebRChNGiNtmWX","main": "spotify:track:2NMHcrOm6MrTkS2vQ7kXX4","market": "spotify:track:5SadVzDPfoUGTeNfYl61b1","manager": "spotify:track:1j7TWX5CHEOjOfjs5jRaSd","matter": "spotify:track:33hgfapjokowLFrHz5wNwu","maintain": "spotify:track:12hDKi0K7PS4GCpQKH5MjD","may": "spotify:track:44i0Y4Ovi9fXMwvYDNE2u2","man": null,"manage": "spotify:track:1v12HurZIwbYnZOS5qs5ek","material": "spotify:track:5fEfYnSWCS9kUYbfQplPaw","management": "spotify:track:5qqpIFDDqq4LTc3kkXIv40","marriage": "spotify:track:7EJ34uSfERLYOL8wfY0hHC","many": null,"majority": "spotify:track:2ZtgS9MDhEV5Txqj7IWmom","make": null,"major": "spotify:track:4b6UymgwM5KjoT6Izy6lfv","maybe": "spotify:track:69ACPjIyTIlGT7kOdYQT58","meet": "spotify:track:5H3SipCqHdsPrUYomizSgN","meeting": "spotify:track:057Fl1JgbiNtL7rKoZrNtV","member": "spotify:track:4aHiKwOzT8IwF3zDfsV9jV","memory": "spotify:track:7JbG4sagE2dZFgvuEB7pxm","mention": "spotify:track:3P14dDMOgaMjxoVj2Pvm40","message": "spotify:track:5RYDOuZRPuFz6rD4JW3rwf","method": "spotify:track:2ucNxoU68inT6XMaAZ8oeQ","might": "spotify:track:6YD0zF5VFBXvwmQqAlZWnE","middle": "spotify:track:0g5EKLgdKvNlln7TNqBByK","military": "spotify:track:7pBf53WWoKGclVpDNkKQcX","million": "spotify:track:1UwXMGkg2fjPqrFOVV1WbY","mind": "spotify:track:3JA9jMcxyKTQSJtCqBH76W","minute": "spotify:track:2a5l5yHBZ25ZpCxy3coRSS","mission": "spotify:track:4GkbFAAS9sml9vtXSIa4tH","miss": "spotify:track:4jXk5qI8cZ3yoIcMWqo9Zb","model": "spotify:track:6GyonEpvG60tYPeuIzKNkl","modern": "spotify:track:2vXMYXu9GLwuLaydal943C","moment": null,"money": null,"more": null,"month": "spotify:track:15549wQkSf5atobqpyBu3k","morning": "spotify:track:2SNtwYtk9a4THKlERP0bMN","most": "spotify:track:20I230rMtdpElFJ48Oq4by","mother": "spotify:track:50WH2WW7dbvRbVFHx9rAzz","mouth": null,"move": "spotify:track:5aFqEqH5uv4nRgTqvgW8PK","movement": "spotify:track:2eJvyiP406OAtWG80cLVa7","Mr": "spotify:track:5StAtILWPcY15nsEKk2mBf","movie": "spotify:track:0kKrJbP4oATz98qQp2iXeC","Mrs": "spotify:track:09i0w7z8BXoOQNxlKieUQM","much": null,"music": null,"must": "spotify:track:7qIzHlAw8V1y1jlonZWToW","my": "spotify:track:0sTrOSCppal1A15Pv3SmBY","myself": "spotify:track:1YiAJ1TTnpkYrnmokwRuoK","name": "spotify:track:1G8jae4jD8mwkXdodqHsBM","nation": "spotify:track:1BF4aJszesyfsUffKuglJU","national": "spotify:track:3y91BoOCNpeoqB9EreNDM4","natural": "spotify:track:7z9TlbrDkEkwKAyScdDamy","nature": "spotify:track:48eaGiv7Pcvk8tVPh1frem","near": "spotify:track:7aWLX0L5EiM9ekJWEoidQA","nearly": "spotify:track:1HG5hfmyxzjPe28IcsoGaO","necessary": "spotify:track:5sZBV6eX3SHTQK254EZNB1","need": "spotify:track:57qNYA18nhcPvVytCf8F8A","never": null,"network": "spotify:track:7jCRNCxRWwtEhP5e4VLV29","new": null,"news": "spotify:track:4LdFhvSwioFDEdOuRQp2MV","newspaper": "spotify:track:1YsWyCYqpA8uZaR9SfYAnY","next": "spotify:track:1aVg1iR4p9wo6uCLjAx4Vx","night": null,"nice": "spotify:track:44lusH2vzc4sRAwsooRhPh","no": null,"none": "spotify:track:7BGQCe62A58Q5ZgpQFX93t","nor": "spotify:track:165TaaTjeIZgSdTboInHrL","north": "spotify:track:0pjBEOWMJTwzzjBrTAlbDd","not": "spotify:track:4Ie6pjxRB6tnTGHdksThzo","note": "spotify:track:0sVnqV5YyGKnHJ5uJ3nDeG","nothing": "spotify:track:1lORkxEMmsCZqhoxcmk3A3","notice": "spotify:track:3YcvahRSttbur9Z8ogIAVC","now": null,"number": "spotify:track:5vFYDQtfL6XCSaiHVRgebD","occur": "spotify:track:1rROXmhfAdYJOh7n8VVySO","of": "spotify:track:07Xfa8tMbtxUK7hUNAF1C3","off": "spotify:track:6Ep81hkUkicOWl5NMFVOIA","offer": "spotify:track:4W8bg1BACC0CPrKUgeduVf","office": "spotify:track:7nl3MKyYcJXUAfFjTOdddF","officer": "spotify:track:57FmgryMQDg7fxbyR65dcT","official": "spotify:track:5BaenQ5VtWUKJBW0As6ie7","often": "spotify:track:71PBDGqqF8RKhCHqDUynSP","oh": null,"oil": "spotify:track:45ptfpd4BLEb6SGB7s8OQF","ok": "spotify:track:3FzVskp2AzuAJQ1KVK9yPq","on": "spotify:track:1irx7injfwpdo5qqo5wdau","old": "spotify:track:3opgvzOPGmWo3HlP9cgW4t","once": "spotify:track:4nRyBgsqXEP2oPfzaMeZr7","one": null,"only": "spotify:track:2Offu6NggcSh6v5PtUNKMK","onto": null,"open": "spotify:track:129QgRfnqQIq8wk8gx9qto","operation": "spotify:track:5oRPd5S6Uv1qFi8ssYIZT0","opportunity": "spotify:track:49I9oKnN3YPmKstfSzvE8M","option": "spotify:track:4I9W4403boTxdaoauH938n","or": "spotify:track:3OR1FPc6xWGlO13WP3LbvY","order": "spotify:track:7lfwqAEjI2hP42Ls6pxydl","organization": "spotify:track:6kGuRwYD7G8V4AykMlxB4a","other": "spotify:track:53soXyY0bcLC1iZEOlIvpX","others": "spotify:track:423rxVUmu2LszpUGC0sLzv","our": "spotify:track:5iyrzxsinadsneddkqnft3","outside": "spotify:track:26EdK0wpLldxvp5R6EjPU9","out": "spotify:track:7DekQNtcD0ForRMbpJqrBD","over": null,"own": null,"owner": "spotify:track:2XOYJTphefHGWeCYICXHqS","page": "spotify:track:491AJvQFRats6kjf4msrvA","pain": "spotify:track:3pH3Htc2dDhwKgJy6G6XQ0","painting": "spotify:track:3j1MH8PFT8V7LIEbewmIH7","paper": "spotify:track:0RkgYLMg4tHCS8NTGORQ14","parent": "spotify:track:43r9oY8vB2Xh7gapfJifa3","part": "spotify:track:7IVXNhQDmT32CeT89RLmbV","particular": "spotify:track:58rqvkLlPZIxNcHXbVqnp1","participant": "spotify:track:3wjYsDsix7Er6dB2oYASdM","particularly": null,"partner": "spotify:track:2Jsquwbe60YMYf7ovbDNlB","party": null,"pass": null,"past": "spotify:track:2xtxL91lK4jlKkZ0RBC7EQ","patient": "spotify:track:2sTIVoyGbmhbYd7a1Ntyzq","pattern": "spotify:track:2e5lrR8dZPj5jMbdf2O3P1","pay": "spotify:track:4U8t8L5c13bEYS1eFKh2pP","picture": "spotify:track:1YrI0FSFlaq38wfII1ned8","peace": "spotify:track:1iTa5Ce0xMfpKsiroD7CLl","piece": null,"people": null,"person": null,"perform": "spotify:track:3pWyZdDmiTGifXb6jo11AZ","period": "spotify:track:5PyoJ8Fe63PKmpQC5398B2","personal": "spotify:track:33KJ2xFYONOlIYDBg6wPx8","pick": null,"phone": "spotify:track:61yntOSHzW2kTeEsLhOH9c","per": "spotify:track:2olKve7AzIiZaemR1EKIEJ","perhaps": null,"physical": "spotify:track:3AzjcOeAmA57TIOr9zF1ZW","performance": "spotify:track:5RiCPLCe9HGi2Nk9CLjIHH","place": "spotify:track:1Bg2CNZw6S4e9cGWPmi0uI","point": "spotify:track:16SWSXK8JXBZ6lF7c4Oxux","police": "spotify:track:4Wo8QI5HAVNV7Aehp0RCJu","policy": "spotify:track:7faBDeByc5GaZ5BWbylOmm","political": "spotify:track:6DI97dOj63oqA6VXTN10eo","politics": "spotify:track:4nHpq9IzWA69frgIhHmHhV","poor": "spotify:track:4FIzM25FD5opNCMApaWkcO","popular": "spotify:track:68HmxpLQDOVTmKqA1gsz4D","population": "spotify:track:4faAI0C9H7ZZfjHS6k51xr","position": "spotify:track:5q4NYj1C7JN2SaP6xgbpRT","positive": "spotify:track:0jRNUypxulXOSAJ1fHCjVx","possible": "spotify:track:3R8zxjolmNJCFb1zGTuE33","power": "spotify:track:2gZUPNdnz5Y45eiGxpHGSc","practice": "spotify:track:5QGUWsEseXhdRRovnJYXeY","price": "spotify:track:7jNnW7e1prkMtR7EKsTElp","process": "spotify:track:7CMDV19vm31ihLvqZUHLAu","produce": "spotify:track:3MIKJaHzNOqWrZOZMJdlbM","problem": "spotify:track:5YSI0veQ9sPV7M3hNyC3kT","private": "spotify:track:28qvEAOVvgNT9SeJONVf0r","pretty": null,"prevent": "spotify:track:6ErJRXh8E8jj43cRtj70S2","probably": "spotify:track:177MB3hsQ1rtqH9HRnI6mX","president": "spotify:track:5IxzlsJ8kuxHxGZAlo0Mqr","product": "spotify:track:7sH4oMHoo1vNmPUPeAe8Mc","professional": "spotify:track:5Ws1ZffEu4HMzsW8FBgtOa","pressure": "spotify:track:7mG2RbhyzGsjpQOz568d39","production": "spotify:track:0AAxIflay974M5KJXQOwQI","present": "spotify:track:3B4V4lIf5usldo1tMKmRmR","professor": "spotify:track:5QMcGat6AJvyn0Qi7sUdv7","provide": "spotify:track:258xXs5rtmrfy0rh1MqvUB","public": "spotify:track:62GH5DHdkPFwD9P2y0TLNe","pull": null,"purpose": "spotify:track:63sI07vZSOyTi9u2sfYvdA","push": null,"put": "spotify:track:4sHnF9N4vHM5jFb5tz6sno","quality": "spotify:track:4EjHBvPtPHFYuvTEvMybSk","question": "spotify:track:6y2DHyCYf6azhUfXmnuH6w","quickly": "spotify:track:70loxR6jmGUSGynKaOcFgz","quite": "spotify:track:2MmTw8lkQzFLL01NIRHsOu","radio": null,"race": "spotify:track:78bcWFqyuhOrC8wnkpgcft","rate": "spotify:track:5RpmPyayQlq6mN5KmXc4ky","realize": "spotify:track:61UHyxKnirRIPPJfEbWrfz","recent": "spotify:track:2cjVILyJaAGAmtOUX6zvES","reach": "spotify:track:2WZSNDOXRvmquKeh0LoIDh","reason": "spotify:track:4JFVNbXqb0yrAlISGU1Kz9","real": null,"rather": "spotify:track:0ZWjQrYkNcTHUFdnxkTpuo","ready": "spotify:track:2DjIya9W0uCWaoUQ1XuRgI","reality": "spotify:track:7hjBP0FdWI6hB3upSEYj75","receive": "spotify:track:0wM17To6MmxRFyvfLPOkVA","read": "spotify:track:2fRqLYsuKZO61RPKpGkMtt","range": "spotify:track:534Y0O3ZBVzVKgIVUL1pCK","really": "spotify:track:2URMA0ap6SAI8wFmcY1yta","raise": "spotify:track:4GtaLc81gqa3OEnqfvWRvS","recently": "spotify:track:1djCoU5rvnq2zXFyD2iqq4","region": "spotify:track:15M3r3keX07O9ukBJAsJJg","relate": "spotify:track:5h0DGzgQpKTyXL0bH5cvXZ","relationship": "spotify:track:3LDrcmfHpNXPusW4mn3O0p","religious": "spotify:track:6Xi3AHHvdqto28QyQK3ACc","remain": "spotify:track:0UU5FzGWcj3NWQ7pgpu9Tj","remember": "spotify:track:4ggnI6JJ35eTzudShy4eug","remove": "spotify:track:3UO9u9u4akfdVY0FswtDLs","report": "spotify:track:0fsefk2FYWgAZuEwXGktMn","represent": "spotify:track:6DPrhGVJ1WTZvM9fKptnGe","Republican": "spotify:track:3CVDvGaR57gzInhZi53KbK","require": "spotify:track:0ZDV8jNOyOzvuKcukXgwsH","research": "spotify:track:2yONe1PeBraRMC9a360rrK","risk": "spotify:track:3S0kgHA5C6sbbJCV4Bscdj","return": "spotify:track:7scijrx5bIwcvugf8vyYjO","respond": "spotify:track:6iSja01gi2IzB9UnhTcO0h","rich": "spotify:track:1afwtzx3IM7uARnylkX1Kg","reveal": "spotify:track:080dGrU87rD7wfnOMNugG0","responsibility": "spotify:track:5ylp5ccraPk0eQXr4z7l9G","response": "spotify:track:113gUF5eYTWLFWqtqYqevQ","rock": null,"rise": "spotify:track:0JxL0Sn0zZ5vX73tLGHAMR","rest": "spotify:track:2JTIxbD4Q7y3LLc7hBRQD8","result": "spotify:track:4zdQ1sHVdAbeGdxEtF8Dg2","right": "spotify:track:1xxiFajRJ8FKpNaolRPEKa","resource": "spotify:track:25u1j5gkEnk4Jk5N9cvTS4","road": "spotify:track:0iannTvGDl7iHMCKvRuil9","role": "spotify:track:7353ZbRUfqYr6iR1DrwoCS","save": "spotify:track:6PhQtCR8y6NLS6CU8etVVC","say": "spotify:track:6wzi4mdt8jwxgkgurnbqiq","scene": "spotify:track:5mlzCJBH5odrqwjYFMTmEm","school": "spotify:track:3oHQBWd7bBZIzaYlPWRKtV","science": "spotify:track:2R71xIUVyMOhOZPFMpRinJ","score": "spotify:track:25CYbT9KptyO4l46A1ne17","scientist": "spotify:track:7wi2uBYizClfN2nVWPZDUE","sea": "spotify:track:3R5SmoqTMQcV5ItpCpzxF0","season": "spotify:track:4Kucn8p48pDkoZdIRCOB01","seat": "spotify:track:7oaw4o7IqCkjch2IuEswls","second": "spotify:track:4z7VuxCsTnRFCjaOpEuuZQ","section": "spotify:track:1b0uD4WSlfbgXBLCXJzvzN","see": null,"security": "spotify:track:6oDP62YynjJXi5vAXm1vm7","seek": "spotify:track:1nDmkSq6qDVIyKpUvS8CJN","seem": null,"sell": "spotify:track:3GKxsNX9LA2mbNBRn0qWKH","send": "spotify:track:1QlhPwjrvV8ydRla6T3cGG","senior": "spotify:track:2nPO8kzjZbLqomVsSUBr3j","sense": "spotify:track:2oeqKWbVwK5Ly2vjwWJKHd","series": "spotify:track:1QqdpmmrpFuo278r34KlD3","serve": "spotify:track:0MohDojCcqTpNATBNWEmEd","serious": "spotify:track:5YoMAg14Fh16BedS8srno2","service": "spotify:track:3OhWbLtsKN3khicu1IszrR","set": "spotify:track:7z5mWK4QtU0IVnSYEohR20","seven": null,"several": "spotify:track:0TWGOsVz4xsJ7kN0zrroMy","sex": "spotify:track:0rlezZnbDIXMUBCPGbczas","shake": null,"sexual": "spotify:track:5fKBwqSTuCbnJlCOpeRa3o","share": "spotify:track:0ou9J9y1q704VHZwkmEABq","shoot": null,"she": "spotify:track:2GzjZVXBVajolZnVsunrl9","short": null,"shot": "spotify:track:5ngCz9o15B9vdUzVQFRrwf","should": "spotify:track:2JPwoMKOVlqVcD5uXMaNO0","show": "spotify:track:6hN88pJWIREfmKmLIapD9Q","shoulder": "spotify:track:2V423gFpb4yyokfl2KdevA","side": null,"sign": "spotify:track:6QiyjquMOWZqaveqmbhmZE","significant": "spotify:track:6NeZblG6o7NubhYYRELNkX","similar": "spotify:track:1pXVIg5u5P31p5KE43r7N8","simple": "spotify:track:2wcQJXsEjvPIvcNfgYFokb","since": "spotify:track:5AQpHAj6PTu9HgLHsu1yAF","simply": "spotify:track:28iLEugUps49dcLQvHcrkR","sing": null,"single": "spotify:track:7loBR3tZW6k2Rjo7jfxSNc","sit": null,"situation": "spotify:track:3YAIqhfzAWSxqf8pmjyAMp","sister": "spotify:track:5zdsN3TgZdJBAGHh0Q1nrd","site": "spotify:track:5nfUYprEV2h4zrVO2SNKkj","six": null,"size": "spotify:track:69Y1STtPtWsKei8l01klHt","skin": null,"skill": "spotify:track:78kZUSuwwd8shuVroK5lIs","small": "spotify:track:3XzGHzCM9m5AaR9ZfU3KB8","smile": "spotify:track:6pw0Smtd6ydy5oywoqRXjY","so": null,"social": "spotify:track:5zxBESMqR6rS6XfSYHmc7J","society": "spotify:track:2y8jjaRWQqKxS1pjgRcnfe","soldier": "spotify:track:0MhCb3iakymVqQIOeYPSUf","somebody": "spotify:track:0YUSLVuHG7yIKPue3TSD1v","some": "spotify:track:3zPTnYmSlQKZLBdKvANMGA","something": "spotify:track:2Vav2LnJyPnahtK3cuMsMj","someone": "spotify:track:1pe0XPDnz9iJRIHOC5uHym","sometimes": "spotify:track:6DkI3nSblvG0TV7uqtRbWd","son": "spotify:track:0QsLPcgRNDxVjtQQfrq5IW","song": null,"soon": "spotify:track:0r11I3mXsMUDRucVWzU3ay","sort": "spotify:track:3NZ61zupLuMXq5ZmI9sgcy","sound": "spotify:track:6Xts2F8JtQIi1brgICe25f","south": "spotify:track:0eJeSAZHzfbywjerKXBJQX","source": "spotify:track:2t2f8SRVqZ7inLKs3Tvg2p","space": "spotify:track:42UY9HIYA0bgQVwNt7JFiH","southern": "spotify:track:3trbVZwxeU4vJBxv8zwmgg","speak": "spotify:track:5sx9hOWgRSJvfYpk1i0RQ6","special": "spotify:track:6e43eqMT1jOEujwQZ2sebM","specific": "spotify:track:6cPtCDCDCqMND75g5mE0nW","speech": "spotify:track:6VYbbbOhCXFpmyuscUPzFP","stand": "spotify:track:0xhiQVCz22skOX51jsrfyE","stage": "spotify:track:7jzYeq5zKzb5Lt0VyBcxC2","star": null,"state": "spotify:track:3E6JfXDQcRPISR52PrVRfU","spring": "spotify:track:42whExZVwNenKpecyuziia","spend": "spotify:track:5e2i1NB3LFcxjJLrtGm7lN","step": null,"station": null,"staff": "spotify:track:1AJfWpWtYENwXqmKP1cXvW","standard": "spotify:track:5lbmAnxLpUytj6AHUZPRbP","sport": "spotify:track:0rRn3j1DLkhEI6XL52Gaie","statement": "spotify:track:6QU4fMPlbjs0EIwXrYdeat","still": null,"start": "spotify:track:2KstxGJWehIQNeTB0J1wn6","stay": "spotify:track:6uBhi9gBXWjanegOb2Phh0","strong": "spotify:track:5bF00VrMY3FwnQDgoP4Gnk","structure": "spotify:track:0bPrLpdfUmqEhYpYa3FO6G","study": "spotify:track:7pu8W0HY5uYw7F6vFvL0K8","student": "spotify:track:0yBgfxL3rBCrOiZ0xMYi8u","style": "spotify:track:18EoHdX6TxU5n0jCfv6Sb3","stuff": "spotify:track:6sCE3da6mVjvSeECeaJZLR","subject": "spotify:track:0LnRvhweMa7hjOBDl5ESRC","successful": "spotify:track:0ugWJXPhPIJNwWR7gXCtx1","success": "spotify:track:7N1SoAwxBF0eHnsbX1hjbj","suddenly": "spotify:track:1qn47XMo28FiaNTKswPqUD","such": "spotify:track:2hsy4faieifgwit03ykjhn","suffer": "spotify:track:7w3MtCR7jKzuiEcH1mWjXN","suggest": "spotify:track:5O08lCTQ2ZrQpm2XwJlfYB","support": "spotify:track:441cf2fNxcN2dyu8KQTJGM","task": "spotify:track:6p3ZWWpM3bm2RKJf6PtF5D","teach": null,"table": "spotify:track:7qe7jQJS8b6HOvTbSvvuQd","take": "spotify:track:7k8iOmEVEElGr6BQnNmzkS","system": "spotify:track:1qIi03YucQ0hSyM08VngF2","tax": "spotify:track:0qAS3wfkxdULwRytoFOVhd","teacher": "spotify:track:39J9gLwAyM6n2c2vFVVvdV","surface": "spotify:track:3XNQcHv58ooZgmKDihifGZ","talk": null,"team": "spotify:track:3G6hD9B2ZHOsgf4WfNu7X1","summer": "spotify:track:46pErPIiLjAWrr5uLFomA0","sure": "spotify:track:6B56Fmuy0BLBTmclq5V2XI","technology": "spotify:track:5HMJjY8TPozkOzzAYiQCK1","than": "spotify:track:6eQ2hFkihzt8r53KTQ13cf","test": "spotify:track:2kJTwDF9AhyUpeafmbeDMs","that": null,"thank": null,"the": "spotify:track:3jB8KumCdBjCEi74KRAaVt","their": "spotify:track:7bxLRMRXj5AAODpNlCDf52","them": "spotify:track:4Hu1fSqaOILcLch1nw0cYE","themselves": "spotify:track:0jwiakOoVQkolSUVTnehVs","then": "spotify:track:59Kv1vtwaWBC7PeW2eC8yk","theory": "spotify:track:1bmz0Rs4sshHNSpJcVDKXd","these": "spotify:track:1aKRrxJ7rwdtQcqAyl6m76","there": null,"thousand": "spotify:track:5365mfBPJseybMEJlyUFPK","they": "spotify:track:5hivagjtjqdvu3ke2aqmc7","throughout": "spotify:track:6QBOnfirh0QddftObWNMOp","thought": "spotify:track:0uC2Td8UkWNcRhGb2iLlEF","through": "spotify:track:3O2f02GgYFMI9luEeWRgA1","third": "spotify:track:0W8PkhZvfsJJuRlRfPdRwp","those": null,"think": "spotify:track:2HtrdkCBIUlRBJ8m46yCFW","threat": "spotify:track:1mmLIpVFHKpVBwd7BE2X7R","throw": "spotify:track:5x9PIacjaOGqcQkmiQBfKG","this": "spotify:track:2nn7wjuhrMnwI0BQ6ebcmu","three": null,"though": null,"thing": "spotify:track:0gCdTKiwV6Vwkx2MrZMPQ3","thus": "spotify:track:2N0JWGysLJVLimfPViecAY","too": null,"top": "spotify:track:0epHGeoR9grP7UtF2H6QJV","total": null,"tough": "spotify:track:2iGqxsVkGdF7ooa6ms577F","toward": "spotify:track:0ruuz8k2MNQvk4yQ4vc1bW","town": "spotify:track:2Yc4BtIYP9cCOJeQrtI8iK","trade": "spotify:track:6yWELmPyFQPFlAoVXdvcBw","traditional": "spotify:track:4M16TxbcpZkIefnygF4NZU","training": "spotify:track:76bv5QyZSfEm9GQ5zkxnfK","travel": "spotify:track:4dMGKGfaWMZNLQEjkd8lme","treat": null,"treatment": "spotify:track:6F940OP4mKqauxlxL4tl6x","tree": "spotify:track:3eNxrQuXBHpLKTCboj2DCn","trial": "spotify:track:6Ua7uW8DjIWQECCnTRmMpM","under": null,"until": "spotify:track:3TM6VELAhbWGSpl16mr9qh","turn": null,"true": "spotify:track:4q2lRiodoQnyFO65watkse","truth": "spotify:track:4JGH4SQ9xZw047NzNOOnyo","TV": "spotify:track:1CmHHhYyBcNNkZl782PhB6","unit": "spotify:track:0mxcRFCHwRTntxz4J4vfuc","type": "spotify:track:7FqUgj7OEDEfAViG05wdMl","try": null,"understand": "spotify:track:3AllE6eMMUwKLj7IsIJaMy","up": "spotify:track:1xximzig1uhm0ednczcrul","trip": "spotify:track:3mAuyxxzjOnd7usCbg6bOf","trouble": null,"two": null,"very": "spotify:track:29Y2Rhlnu92vmWZbVV91BK","victim": "spotify:track:3zVaF3xzTTeXsH9CrP7Z1I","view": "spotify:track:676mhFljpBVpRYAtKlPxu6","violence": "spotify:track:6tVZqwGWmXHGqXcMrvROoj","visit": "spotify:track:5YiAoW2Pq8l3SwTo364Nd2","voice": "spotify:track:1mSY6iQtA3mV9gFUnKmG9R","vote": "spotify:track:0ybx05njA56ysfJj7wtJNh","wait": "spotify:track:4Yfbsn2om3M0XEiSuQAiux","walk": null,"wall": "spotify:track:5RNjqNPhSr0Bk1HimXlGjL","want": "spotify:track:6AFz1yXS7boPZlqJd2R7WS","war": null,"weight": "spotify:track:2HXCkdSlpYueDw46oEfVwb","when": "spotify:track:5K1w7KIoAApnShOAS0wAtu","western": "spotify:track:19aTQTpqhxbJkkEZexsche","weapon": "spotify:track:0jdi6xVBhk96OEoO53yORN","whatever": "spotify:track:6YzZPRJRiyAua3HaAmBJKT","wear": "spotify:track:35KotAaUwNaqgZgd2Q6iz1","we": "spotify:track:3iRum8y8yPlUI8nqAKwzWS","well": null,"week": "spotify:track:3S8fs8StVmSHn9Afz0g4Lk","way": null,"west": "spotify:track:7fsyWCQEsIcnfHXlOcoKZX","watch": "spotify:track:0TyOl92OglpITY6dzwAE8P","what": "spotify:track:1poZzimDIjx4d5FVhxbaiV","water": "spotify:track:042Mrb1KGUOq6GY45PLRJh","where": "spotify:track:2Bwv7wthxiPhyFVlux9HCX","whole": "spotify:track:1IJMLMoVEJZRZWWQwUT7FO","whom": "spotify:track:4bUWNO7x6LoJVXO35KKQ2D","whose": "spotify:track:6pd9f61LuJ9AtG5mjmCFzw","why": null,"wide": "spotify:track:3gjtg1BtJ9hNmgTkEbdwyo","will": "spotify:track:47AgNYtwK32hlkZjGyyp6H","wife": "spotify:track:2N6gXSttR2rK6mSXSc9PQS","win": "spotify:track:3kTnh3v0pqRgL3WgULx8aD","wind": "spotify:track:7lohhY1txSvT9tJDttzVij","window": "spotify:track:7b6x2gExLX22huJvNysffw","wish": "spotify:track:7lxOjQyVsHQ8toQeT7IgCc","with": "spotify:track:50C6GvPnA3f1rb70aPq0lb","within": "spotify:track:5vPITSF2CcP4QVKoxf4mkl","woman": null,"without": "spotify:track:5FnoYSvkAqXDSYdURs1d3M","wonder": "spotify:track:5KCbr5ndeby4y4ggthdiAb","word": null,"work": "spotify:track:72TFWvU3wUYdUuxejTTIzt","world": "spotify:track:6f7xPDY1G2QQx2NjGKRT1N","worker": "spotify:track:5Lsnuxcsp1StalJyvya1Ui","worry": "spotify:track:1Ox8etk0XoGLwG6ZJUUFjo","would": "spotify:track:4A4nn6rnnYHwkvFr7hR8Bs","write": "spotify:track:6uR38rcDEIMLBkAs6kXoxH","writer": "spotify:track:0rtiCt9UY04vWHE3iQVBd0","wrong": "spotify:track:1EpjMVaoloW4sLIdfVD6P8","yeah": null,"yard": "spotify:track:7KizYdqxU4ZUQ6lrgIPwRd","year": "spotify:track:7kLc8EWtJzSnoPLp0T0GlP","yes": "spotify:track:0Rdfu7NQubmGmYz90usRCU","yet": "spotify:track:7zNjwtabHO1iDQffX2XVhx","you": "spotify:track:2cc8sw1oncua5bv8nqwqpe","young": "spotify:track:1fCSnotiP3cen8C6uyCKbd","your": "spotify:track:1aundo06qxiotvcz16p5ri","yourself": "spotify:track:68yx2mpRze1x0zkq0I5GwE","to": "spotify:track:6iMuCTZBjRuiEXSU5Ou0Fs", "brought":"spotify:track:4OjV5scLrlQgkRIoBwmnU9", "thats":"spotify:track:60YHYHfg5SIMkIes6V7zd6", "is":"spotify:track:49btaekHYb61zr8VTpFsmg", "am":"spotify:track:5SkShE3Vc3iIDM9GOlboRd", "an":"spotify:track:07sWA2QoqD5Y0EzAaf0z1g", "me":"spotify:track:2VNJT39q9DFE5C9HDiuyja", "which": "spotify:track:5FnSPC7RdDNvtR24DkpJkJ", "is":"spotify:track:1uQU0TzXDlCT01pqIbMSkF"};
		let wordGrouping = '"';
		for(let index = 0; index < words.length; index++){
			(index == 0) ? 
				wordGrouping += words[index].replace(/[^\w\s]|_/g, '')
				:
				wordGrouping += " " + words[index].replace(/[^\w\s]|_/g, '');
		}
		wordGrouping += '"';
		console.log('wordGrouping', wordGrouping);
		let apiResults = await searchAPI(wordGrouping, 0);
		let trackHit = checkMatch(apiResults, wordGrouping);
		if(trackHit){
			console.log("HIT: " + words.length + ": " + trackHit.name);
			return {size:words.length, track:trackHit};
		} else {
			if(words.length > 1){
				return queryWords(words.slice(0, words.length - 1));
			} else if(wordGrouping != "") {
				// Check songLibrary object to see if track name appears. If so, grab URL and return. If not, continue.
				window.topWordSongsWithUris = topWordSongsWithUris;
				let manualTrackHit = topWordSongsWithUris[wordGrouping.toLowerCase().replace(/[^\w\s]|_/g, '')];
				if(manualTrackHit){
					console.log("MANUAL HIT: " + words.length + ": " + wordGrouping.toLowerCase());
					let trackObj = {uri:manualTrackHit};
					return {size:words.length, track:trackObj};
				} else {
					// Query Music Brainz for a song name that matches. 
					// If so, get the artist. Then query Spotify alongside the artist name. 
					let artists = await getArtistsFromMB(wordGrouping);
					let hitFound = false;
					console.log("artists from MB");
					console.log(artists);
					if(artists != null){
						if(artists.length > 0){
							for(let i = 0; i < artists.length; i++){
								if(i > 4){ break };
								let apiResults = await searchAPI(wordGrouping, 0, artists[i]);
								let trackHit = checkMatch(apiResults, wordGrouping);
								if(trackHit){
									console.log("HIT – ARTIST: " + words.length + ": " + trackHit.name);
									hitFound = true;
									return {size:words.length, track:trackHit};
								}
							}
						}
					}
					if(!hitFound){
						console.log("Page 2 search");
						let apiResults = await searchAPI(wordGrouping, 51);
						let trackHit = checkMatch(apiResults, wordGrouping);
						if(trackHit){
							console.log("HIT – PAGE 2: " + words.length + ": " + trackHit.name);
							hitFound = true;
							return {size:words.length, track:trackHit};
						} else {
							console.log("Page 3 search");
							let apiResults = await searchAPI(wordGrouping, 101);
							let trackHit = checkMatch(apiResults, wordGrouping);
							if(trackHit){
								console.log("HIT – PAGE 3: " + words.length + ": " + trackHit.name);
								return {size:words.length, track:trackHit};
							}
						}
					}
				}
			}
			return {size:0, track:null};
		}
	}


	async function getArtistsFromMB(input){
		return new Promise(function(resolve, reject){
			let strippedInput = input.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/[^\w\s]|_/g, '').toUpperCase();
			console.log('strippedInput', strippedInput);
			let url = 'https://musicbrainz.org/ws/2/recording?query=recording:"' + strippedInput + '"&fmt=json&limit=100';
			fetch(url)
			.then((response) => {
				console.log(response);
				if (!response.ok) {
					throw new Error("HTTP status " + response.status);
				}
				return response.json();
			})
			.then((data) => {
				let artists = [];
				console.log(data);
				if(data.recordings.length > 0){
					for(let j = 0; j < data.recordings.length; j++){
						if(data.recordings[j].title.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/[^\w\s]|_/g, '').toUpperCase() == strippedInput){
							artists.push(data.recordings[j]["artist-credit"][0].name);
							break;
						}
					}
				}
				resolve(artists);
			})
			.catch((error) => {
				console.error("Error:", error);
			});
		});
	}

	// This was a one-time function that I used to populate a json object with track titles / artists that match the top 1000 english words. 
	function queryMusicBrains(){
		const topThousandWords = [
			'a','ability','able','about','above','accept','according','account','across','act','action','activity','actually','add','address','administration','admit','adult','affect','after','again','against','age','agency','agent','ago','agree','agreement','ahead','air','all','allow','almost','alone','along','already','also','although','always','American','among','amount','analysis','and','animal','another','answer','any','anyone','anything','appear','apply','approach','area','argue','arm','around','arrive','art','article','artist','as','ask','assume','at','attack','attention','attorney','audience','author','authority','available','avoid','away','baby','back','bad','bag','ball','bank','bar','base','be','beat','beautiful','because','become','bed','before','begin','behavior','behind','believe','benefit','best','better','between','beyond','big','bill','billion','bit','black','blood','blue','board','body','book','born','both','box','boy','break','bring','brother','budget','build','building','business','but','buy','by','call','camera','campaign','can','cancer','candidate','capital','car','card','care','career','carry','case','catch','cause','cell','center','central','century','certain','certainly','chair','challenge','chance','change','character','charge','check','child','choice','choose','church','citizen','city','civil','claim','class','clear','clearly','close','coach','cold','collection','college','color','come','commercial','common','community','company','compare','computer','concern','condition','conference','Congress','consider','consumer','contain','continue','control','cost','could','country','couple','course','court','cover','create','crime','cultural','culture','cup','current','customer','cut','dark','data','daughter','day','dead','deal','death','debate','decade','decide','decision','deep','defense','degree','Democrat','democratic','describe','design','despite','detail','determine','develop','development','die','difference','different','difficult','dinner','direction','director','discover','discuss','discussion','disease','do','doctor','dog','door','down','draw','dream','drive','drop','drug','during','each','early','east','easy','eat','economic','economy','edge','education','effect','effort','eight','either','election','else','employee','end','energy','enjoy','enough','enter','entire','environment','environmental','especially','establish','even','evening','event','ever','every','everybody','everyone','everything','evidence','exactly','example','executive','exist','expect','experience','expert','explain','eye','face','fact','factor','fail','fall','family','far','fast','father','fear','federal','feel','feeling','few','field','fight','figure','fill','film','final','finally','financial','find','fine','finger','finish','fire','firm','first','fish','five','floor','fly','focus','follow','food','foot','for','force','foreign','forget','form','former','forward','four','free','friend','from','front','full','fund','future','game','garden','gas','general','generation','get','girl','give','glass','go','goal','good','government','great','green','ground','group','grow','growth','guess','gun','guy','hair','half','hand','hang','happen','happy','hard','have','he','head','health','hear','heart','heat','heavy','help','her','here','herself','high','him','himself','his','history','hit','hold','home','hope','hospital','hot','hotel','hour','house','how','however','huge','human','hundred','husband','I','idea','identify','if','image','imagine','impact','important','improve','in','include','including','increase','indeed','indicate','individual','industry','information','inside','instead','institution','interest','interesting','international','interview','into','investment','involve','issue','it','item','its','itself','job','join','just','keep','key','kid','kill','kind','kitchen','know','knowledge','land','language','large','last','late','later','laugh','law','lawyer','lay','lead','leader','learn','least','leave','left','leg','legal','less','let','letter','level','lie','life','light','like','likely','line','list','listen','little','live','local','long','look','lose','loss','lot','love','low','machine','magazine','main','maintain','major','majority','make','man','manage','management','manager','many','market','marriage','material','matter','may','maybe','me','mean','measure','media','medical','meet','meeting','member','memory','mention','message','method','middle','might','military','million','mind','minute','miss','mission','model','modern','moment','money','month','more','morning','most','mother','mouth','move','movement','movie','Mr','Mrs','much','music','must','my','myself','name','nation','national','natural','nature','near','nearly','necessary','need','network','never','new','news','newspaper','next','nice','night','no','none','nor','north','not','note','nothing','notice','now','number','occur','of','off','offer','office','officer','official','often','oh','oil','ok','old','on','once','one','only','onto','open','operation','opportunity','option','or','order','organization','other','others','our','out','outside','over','own','owner','page','pain','painting','paper','parent','part','participant','particular','particularly','partner','party','pass','past','patient','pattern','pay','peace','people','per','perform','performance','perhaps','period','person','personal','phone','physical','pick','picture','piece','place','plan','plant','play','player','PM','point','police','policy','political','politics','poor','popular','population','position','positive','possible','power','practice','prepare','present','president','pressure','pretty','prevent','price','private','probably','problem','process','produce','product','production','professional','professor','program','project','property','protect','prove','provide','public','pull','purpose','push','put','quality','question','quickly','quite','race','radio','raise','range','rate','rather','reach','read','ready','real','reality','realize','really','reason','receive','recent','recently','recognize','record','red','reduce','reflect','region','relate','relationship','religious','remain','remember','remove','report','represent','Republican','require','research','resource','respond','response','responsibility','rest','result','return','reveal','rich','right','rise','risk','road','rock','role','room','rule','run','safe','same','save','say','scene','school','science','scientist','score','sea','season','seat','second','section','security','see','seek','seem','sell','send','senior','sense','series','serious','serve','service','set','seven','several','sex','sexual','shake','share','she','shoot','short','shot','should','shoulder','show','side','sign','significant','similar','simple','simply','since','sing','single','sister','sit','site','situation','six','size','skill','skin','small','smile','so','social','society','soldier','some','somebody','someone','something','sometimes','son','song','soon','sort','sound','source','south','southern','space','speak','special','specific','speech','spend','sport','spring','staff','stage','stand','standard','star','start','state','statement','station','stay','step','still','stock','stop','store','story','strategy','street','strong','structure','student','study','stuff','style','subject','success','successful','such','suddenly','suffer','suggest','summer','support','sure','surface','system','table','take','talk','task','tax','teach','teacher','team','technology','television','tell','ten','tend','term','test','than','thank','that','the','their','them','themselves','then','theory','there','these','they','thing','think','third','this','those','though','thought','thousand','threat','three','through','throughout','throw','thus','time','to','today','together','tonight','too','top','total','tough','toward','town','trade','traditional','training','travel','treat','treatment','tree','trial','trip','trouble','true','truth','try','turn','TV','two','type','under','understand','unit','until','up','upon','us','use','usually','value','various','very','victim','view','violence','visit','voice','vote','wait','walk','wall','want','war','watch','water','way','we','weapon','wear','week','weight','well','west','western','what','whatever','when','where','whether','which','while','white','who','whole','whom','whose','why','wide','wife','will','win','wind','window','wish','with','within','without','woman','wonder','word','work','worker','world','worry','would','write','writer','wrong','yard','yeah','year','yes','yet','you','young','your','yourself'
		];
		let topWordSongs = {};
		let promises = [];
		window.topWordSongs = topWordSongs;
		for (let i = 0; i < 999; i++) {
			let url = 'https://musicbrainz.org/ws/2/recording?query=recording:"' + topThousandWords[i] + '"&fmt=json&limit=100';
			let promise = new Promise((resolve, reject) => {
				setTimeout(() => {
					fetch(url)
					.then((response) => {
						if (!response.ok) {
							throw new Error("HTTP status " + response.status);
						}
						return response.json();
					})
					.then((data) => {
						for(let j = 0; j < data.recordings.length; j++){
							if(data.recordings[j].title.toUpperCase() == topThousandWords[i].toUpperCase()){
								const artistName = data.recordings[j]["artist-credit"][0].name;
								topWordSongs[topThousandWords[i]] = artistName;
								console.log(data.recordings[j].title + ": " +  artistName);
								break;
							} else if(j == data.recordings.length - 1){
								topWordSongs[topThousandWords[i]] = null;
								console.log(topThousandWords[i] + ": null");
							}
						}
						window.topWordSongs = topWordSongs;
						resolve();
					})
					.catch((error) => {
						console.error("Error:", error);
						reject(error);
					});
				}, i * 1500); // Delay each request by i seconds
			});
			promises.push(promise);
			window.topWordSongs = topWordSongs;
		}
		Promise.all(promises).then(() => {
			window.topWordSongs = topWordSongs;
			console.log(topWordSongs);
			console.log(JSON.stringify(topWordSongs));
		}).catch((error) => {
			console.error("Error:", error);
		});
	}

	async function getURIs(){
		const topWordSongs = [{"a":null,"ability":"Interface","able":"Headache24","about":"Melt‐Banana","above":"Mark Norman","accept":"Gnashing of Teeth","according":"Ian Void","account":"Slumgudgeon","across":"Workafiction","act":"Ephemera","action":"John Zorn","activity":"Way Out West","actually":"Capewalk","add":"General Rudie","address":"Milemarker","administration":"服部隆之","admit":"Sister Machine Gun","adult":"John Foxx","affect":"Alexander Shukaev","after":"dZihan & Kamien","again":null,"against":"Straight Faced","age":"Pink Lincolns","agency":"Chaonaut","agent":"Abwärts","ago":"Sky Salt","agree":"Later Days","agreement":"HCD Productions","ahead":"Bach Is Dead","air":"Adam Again","all":null,"allow":"Nasty C","almost":"Blues Brothers","alone":"42 Faces","along":"Ronfoller","already":"Nik Kershaw","also":"Gregory Isaacs","although":"McAlmont & Butler","always":"Bent","American":"Triple Fast Action","among":"morningtime","amount":"Sync","analysis":"The Cable Car Theory","and":"King Missile","animal":"The Neanderthal","another":"Heroin","answer":"Judgement of Paris","any":"ヤなことそっとミュート","anyone":"Roxette","anything":"Eric Burdon","appear":"宮崎誠","apply":"Element of Surprise","approach":"Dust","area":"Percy Jones","argue":"Matchbox Twenty","arm":"The Feelers","around":null,"arrive":"Benna","art":"Taproot","article":"Lowfish","artist":"Sharko","as":"Jean‐Luc Ponty","ask":"Tuluyhan Uğurlu","assume":"The Fall","at":"Kit Clayton","attack":"The Jon Spencer Blues Explosion","attention":"GusGus","attorney":"DIE MY CHILD","audience":"Farside","author":"cupcakKe","authority":"Biohazard","available":"Playa","avoid":"Motherwell","away":"Assemblage 23","baby":null,"back":null,"bad":null,"bag":"RevenG","ball":"The Wannadies","bank":"Roland Düringer","bar":"Spring Heel Jack","base":"Fusionic","be":"Marty Friedman","beat":"McAlmont & Butler","beautiful":"Jesus Army","because":"The Wannadies","become":"The Wind-Up Bird","bed":"The Tony Rich Project","before":"dZihan & Kamien","begin":"Alias","behavior":"Ko-Wreck Technique","behind":"M.O.D.","believe":"Elton John","benefit":"Eric Bogosian","best":"조성모","better":"Pinki Mojo","between":"Vienna Teng","beyond":"Herb Alpert","big":null,"bill":"Seaweed","billion":"Cardiacs","bit":"AFX","black":null,"blood":null,"blue":null,"board":"Bodyjar","body":null,"book":"Ichor","born":"Blindside","both":"Ingrid Andress","box":"Locomotiv GT","boy":null,"break":"Staind","bring":"The Spits","brother":null,"budget":"Yellowman","build":"The Minders","building":"Of 1942","business":"Biohazard","but":"The Fat Lady Sings","buy":"Smerz","by":null,"call":"The Blacks","camera":"Junk Project","campaign":"Seka","can":null,"cancer":"Døgma","candidate":"Dramarama","capital":"Vulgaires machins","car":"Built to Spill","card":"D","care":"Dada (ante portas)","career":"Party Day","carry":"Sandbox","case":"Katzo","catch":"The Cure","cause":"ALL","cell":"Sunday Munich","center":"Eltro","central":"Nord Express","century":"Itch‐E & Scratch‐E","certain":"Bertine Zetlitz","certainly":"Marco V","chair":"Sister Soleil","challenge":"Grip Inc.","chance":"Big Country","change":"Mest","character":"Aziza Mustafa Zadeh","charge":"Asian Dub Foundation","check":"Max Webster","child":"Didier Marouani","choice":"Klockwork","choose":"Anti-Heros","church":"Galactic","citizen":"Faculty X","city":"Commissioned","civil":"Rich Aucoin","claim":"Z Prochek","class":"Oval","clear":"Zeta","clearly":"Barbara K","close":"Josh Joplin Band","coach":"Faux Pas","cold":null,"collection":"Jandek","college":"Conor Oberst","color":"Nicole C. Mullen","come":null,"commercial":"The Jesus and Mary Chain","common":"One Six Conspiracy","community":"Philip Jeck","company":"Megan Slankard","compare":"Film School","computer":"The Wildbunch","concern":"Reset","condition":"Ruth Ruth","conference":"De Vliegende Panters","Congress":"Slàinte Mhath","consider":"The Choir","consumer":"Focused","contain":"Plastikman","continue":"伊勢聡","control":"China Drum","cost":"Juiceslf","could":"The Snowy Owls","country":"Leb i Sol","couple":"J=J","course":"Stanford Prison Experiment","court":"Tilman Ehrhorn","cover":"Lunarclick","create":"Pentatonik","crime":"Regina Lund","cultural":"H-O-M-E","culture":"Kana","cup":"The Shroud","current":"Sofa","customer":"Kitty Wu","cut":"Katell Keineg","dark":"The Makers","data":"Philip Glass","daughter":"Pearl Jam","day":null,"dead":"Sprung Monkey","deal":"Grateful Dead","death":"Apartment 26","debate":"Until Rain","decade":"Embodyment","decide":"Shutdown","decision":"Zbigniew Preisner","deep":null,"defense":"Bliss 66","degree":"Positive Merge","Democrat":"Chicks","democratic":"Viktor Van River","describe":"Christopher Franke","design":"Gentle Giant","despite":"Jale","detail":"THE RODEO CARBURETTOR","determine":"Fernandes Lima","develop":"岩崎琢","development":"Nonpoint","die":null,"difference":"Shawn Desman","different":"Accessory","difficult":"Kill Me Tomorrow","dinner":"The Evolution Control Committee","direction":"Midtown","director":"LAY","discover":"Tim Booth","discuss":"Stopmakingme","discussion":"Marie Daulne","disease":"Biohazard","do":null,"doctor":null,"dog":null,"door":"High Rise","down":null,"draw":"EPMD","dream":null,"drive":"All Star United","drop":"Filur","drug":"Terminal Cheesecake","during":"Savvas Metaxas","each":"gutfürnkeller","early":"Chicane","east":"Humate","easy":"Liz Phair","eat":"Martha Cinader's Po'azz Yö'azz","economic":null,"economy":"Children Collide","edge":"Jim Johnston","education":"Burning Spear","effect":"The7Method","effort":"EEJUNGMI","eight":"OneSideZero","either":"Allen Toussaint","election":"Eskimo Joe","else":"Built to Spill","employee":"Nowhere Squares","end":"Noise Ratchet","energy":"Vhäldemar","enjoy":"Descendents","enough":null,"enter":"Swan Lee","entire":"The Spinanes","environment":"Nightmares on Wax","environmental":"Rick Baker","especially":"illion","establish":"Metal Yuhki","even":"Thirstin Howl III","evening":"T‐Bone Walker","event":"Spite of Opposition","ever":"Alan Stivell","every":"Marlango","everybody":"Bad Boy Bill","everyone":"Adema","everything":null,"evidence":"Bud Powell","exactly":"Boac","example":"DJ Honda","executive":"Frisk","exist":"Youth Alive","expect":"Ghoti Hook","experience":"Gentle Giant","expert":"Dungeon Master","explain":"Adi Lukovac","eye":null,"face":null,"fact":"Silent Poets","factor":"John Zorn","fail":"Adi Lukovac","fall":"Dag Nasty","family":"Bill Frisell","far":null,"fast":"Rikk Agnew","father":"The Vineyard","fear":"Miranda Sex Garden","federal":"Christy Doran","feel":"Jesus Army","feeling":"The Jelly Jam","few":"Yokota","field":"Biosphere","fight":null,"figure":"Richard Buckner","fill":"Can'O'Lard","film":"The Church","final":"Rodrigo Leão and Vox Ensemble","finally":"Donna Regina","financial":"Hal Hartley","find":"Blisse","fine":null,"finger":"Die Aeronauten","finish":"C‐Murder","fire":null,"firm":"Nailed Promise","first":null,"fish":"Captain Tractor","five":"Kronos Quartet","floor":"Paperclip People","fly":null,"focus":"The Crucified","follow":"Edith Frost","food":"Warfare88","foot":"Love Battery","for":"Caliban","force":"Technasia","foreign":"Earthsuit","forget":"Maarja","form":"Hinge","former":"Richard Easton","forward":"Sound Tribe Sector 9","four":"Bass Communion","free":"For Real","friend":"Quickspace","from":"Yokota","front":"Insolence","full":"Mokira","fund":"Eagles","future":"Cirrus","game":"Beady Belle","garden":"Marty Simon","gas":"The New Duncan Imperials","general":"Buju Banton","generation":"The Jelly Bean Bandits","get":null,"girl":"Luka Bloom","give":"Rockapella","glass":"King Missile","go":null,"goal":"AA Project","good":null,"government":"Union 13","great":"Fred Hammond","green":null,"ground":"The Vandermark 5","group":"Tomoo Kosugi","grow":"Majesty Crush","growth":"India.Arie","guess":"Magnapop","gun":"Siouxsie and the Banshees","guy":"Wegrowbeards","hair":"Galt MacDermot","half":"Wives","hand":null,"hang":"Matchbox Twenty","happen":"Drop Nineteens","happy":null,"hard":"Grey Eye Glances","have":"Axiome","he":"Moby Grape","head":"Tin Star","health":"Babe the Blue Ox","hear":"Moonpools & Caterpillars","heart":null,"heat":"Don Tiki","heavy":"The Come Ons","help":"Stir","her":"Guy","here":"Luscious Jackson","herself":"Josh Weathers Band","high":"Tripping Daisy","him":"James L. Venable","himself":"Today Is the Day","his":"Dave I.D.","history":"Goldsmiths (Jesus Army)","hit":"Spookrijders","hold":"Rorschach Test","home":null,"hope":"Screaming Headless Torsos","hospital":"Michael Knott","hot":null,"hotel":"Montezuma’s Revenge","hour":"Saadet Türköz","house":"I Start Counting","how":"Spacek","however":"Wackside","huge":"BulletBoys","human":"Elastica","hundred":"Matthew O'Bannon","husband":"Freak Power","I":null,"idea":"Microdisney","identify":"Natalie Imbruglia","if":"Biscuit Boy (a.k.a. Crackerman)","image":"Burning Spear","imagine":"Attila Fias","impact":"Against Me!","important":"Firma","improve":"Darrow Fletcher","in":"mr Epic","include":"AnalogX","including":"The Utility Project","increase":"Strongarm","indeed":"Bluestring","indicate":"Function","individual":"Spacefly","industry":"Wyclef Jean","information":"Neural Network","inside":"Stiltskin","instead":"Dressy Bessy","institution":"The Mekons","interest":"Tel Aviv","interesting":"Voon","international":"Laidback","interview":"Björn Ulvaeus","into":"Scout Niblett","investment":"Downrage","involve":"Alan Fitzpatrick","issue":"Hoarse","it":"Insane Clown Posse","item":"Jacek Sienkiewcz","its":"Vaervaf","itself":"Kim Justice","job":"Naftule’s Dream","join":"No Longer Music","just":"Radiohead","keep":"Gary Jules","key":"浜崎あゆみ","kid":"Green Apple Quick Step","kill":null,"kind":"Herman van Veen","know":"Jeremy Toback","knowledge":"The Aquabats!","land":"Fifteen","language":"Dave Dobbyn","large":"Bambi Cruz","last":"Mere Mortals","late":"face to face","later":"Dr. Didg","laugh":"The Alchemysts","law":"Charles Bukowski","lawyer":"Bob Evans","lay":null,"lead":"Unsane","leader":"Polar Bear","learn":"Lamb","least":"Monstrum Sepsis","leave":"The Tragically Hip","left":"Giant Sand","leg":"Garrin Benfield","legal":"Lament","less":"Erik Truffaz","let":"Desmod","letter":"Justincase","level":"Bongo Maffin","lie":null,"life":null,"light":"Chomsky","like":"Taproot","likely":"Ada","line":"Niowt","list":"Adi Lukovac","listen":"Dwight Yoakam","little":null,"live":null,"local":"Charlie Brown Jr.","long":null,"look":"The Beach Boys","lose":"Gruntruck","loss":"Gardenian","lot":"Christie Front Drive","love":null,"low":"The Killjoys","machine":"The Buddy Rich Big Band","magazine":"Suckerpunch","main":"崎元仁","market":"Luomo","manager":"Rio Reiser","matter":"Up Front","maintain":"Devoid of Faith","may":"Brittle Stars","man":null,"manage":"John Dahlbäck","material":"Die Warzau","management":"Neil Hamburger","marriage":"Rivets","many":"Freeform","majority":"The Alarm","make":"Bailterspace","major":"Radioactive Man","maybe":"Satellite Soul","meet":"Moonlik","meeting":"Romantic Warrior","member":"Kid Spatula","memory":"No December","mention":"Apache Indian","message":"Burning Spear","method":"Orange 9mm","middle":"Jimmy Eat World","might":"Makayla Phillips","military":"Volcano the Bear","million":"Frenzal Rhomb","mind":"Funeral Oration","minute":"Pat McGee Band","miss":"Mira","mission":"Shaggy","model":"Candle's End","modern":"Peter Hammill","moment":null,"money":null,"month":"Useless ID","more":null,"morning":"Smappies","most":"Saba","mother":"Cyndi Lauper","mouth":null,"move":"Christian Smith & John Selway","movement":"Xebox","movie":"Montreux","Mr":"Lethal Bizzle","Mrs":"Emeka","much":null,"music":null,"must":"Oddjob","my":null,"myself":"Taproot","name":"Goo Goo Dolls","nation":"Big Pig","national":"Love 666","natural":"Mobius Strip","nature":"The Jelly Jam","near":"Haji's Kitchen","nearly":"King Kooba","necessary":"Boogie Down Productions","need":"Chomsky","network":"The Pharcyde","never":null,"new":null,"news":"Mathuresh","newspaper":"DSB","next":"Raised Fist","nice":"Thisway","night":"spotify:track:305AMS2fhp16LoYxKiYsXF","no":"spotify:track:7reG3QYhefsJNpcVJq4BZr","none":"Santo & Johnny","nor":"Ritter Lechner Coleman","north":"Coil","not":"Sin 34","note":"Karen Ires","nothing":null,"notice":"Ziggy Marley & The Melody Makers","now":null,"number":"Vhäldemar","occur":"Dean de Benedictis","of":"Nite System","off":"Sir Positive","offer":"Doug Martsch","office":"Rob Crow","officer":"Operation Ivy","official":"Lathun","often":"Robbie Williams","oh":null,"oil":"Radio Boy","ok":"Riddlin’ Kids","old":"The Tiger Lillies","on":null,"once":"Pearl Jam","one":null,"only":"Ass Ponys","onto":"Spoiled Drama","open":"King Missile","operation":"The Producers","opportunity":"Aztek Trip","option":"Naomi","or":"Smolik","order":"Tellus","organization":"Gameface","other":"The Blue Up?","others":"Tennessee Ernie Ford","our":"Postmortem","out":"The Charlatans","outside":"Lou Reed","over":null,"own":"Westcoast","owner":"Acrnym","page":"Sjako!","pain":"Rose Tattoo","painting":"John Patitucci","paper":"The Standard","parent":"Vessel","part":"Breaking Pangaea","participant":"Railroad Jerk","particular":"Racoon","particularly":null,"partner":"Hans Dorrestijn","party":null,"pass":"岩崎琢","past":"Sub Sub","patient":"Corpus Delicti","pattern":"Frogwings","pay":"Tree","peace":"Nicholas & Veruschka","picture":"Tomas Bodin","piece":null,"people":null,"person":null,"perform":"Leviride","period":"Super Hi-Five","personal":"E‐40","pick":"The Buzzhorn","phone":"Sunday Munich","per":"Marie Key Band","physical":"Machine Gun Fellatio","perhaps":null,"performance":"Van Kooten & De Bie","place":"Kim Justice","point":"Gunmoll","police":"Dallas","policy":"Sampson","political":"Spirit of the West","politics":"Pitboss 2000","poor":"Supersuckers","popular":"Taja Sevelle","population":"Bounty Killer","position":"Mr. Vegas","positive":"Black Uhuru","possible":"Baxter","power":"aDuck","practice":"Cory Sipper","price":"Monoid","process":"John Lee Hooker","produce":"VILDE","problem":"Reeves Gabrels","private":"Hoover","prevent":"Khayo Ben Yahmeen","pretty":null,"probably":"Kevin Devine","president":"Jan Eggum","product":"Battery Cage","professional":"Young Steff","pressure":"Anathema","production":"The Wiseguys","present":"Burning Spear","professor":"James L. Venable","provide":"DJ Shoko","public":"Whitehouse","pull":"We™","purpose":"Benümb","push":null,"put":"Partibrejkers","quality":"Accustomed to Nothing","question":"The Fixx","quickly":".anxious.","quite":"The Autumns","race":"Bleach","radio":null,"rate":"Kouhei Matsunaga","realize":"Ours","recent":"Barren","reach":"Sometime Sunday","reason":"Aghast View","real":null,"ready":"Swell","rather":"Salaryman","reality":"Digital Orgasm","receive":"Poor Old Lu","read":"D’Arcangelo","range":"Rhythm & Sound","really":"UB40","raise":"Greg Osby","recently":"Dave Matthews Band","region":"John Zorn","relate":"Tait","relationship":"Lakeside","religious":"Musiq","remain":"By the Tree","remember":"For Real","remove":"Madonna Hip Hop Massaker","report":"安田拓也","represent":"Peshay","Republican":"Forbes","require":"Dan Reitz","research":"Cause 4 Concern","risk":"Frente!","return":"Majistrate","respond":"Sidekick","rich":"Orbient","reveal":"By the Tree","responsibility":"Steve Forbert","response":"Snowglobe","rock":null,"rise":"Marco V","rest":"Kim Barlow","result":"弘田佳孝","right":"Yuppicide","resource":"Paul Brtschitsch","road":"Chomsky","role":"Audra Kubat","save":"Idaho","say":null,"scene":"10 Second Break","school":"Apathy","science":"Paul Weller","scientist":"Scientist","score":"Gringo","sea":"Smith & Mighty","season":"Ash","seat":"Kouhei Matsunaga","second":"Bear vs. Shark","section":"Napalm Death","security":"Mike Harrison","see":null,"seek":"Tragedy Ann","seem":"The Get Quick","sell":"Jennifer Touch","send":"Ellen Allien","senior":"Freak Motif","sense":"centrozoon","series":"Interloper","serious":"DJ Hype","serve":"The Neon Judgement","service":"Certain General","set":"Youssou N’Dour","seven":null,"several":"Christian Kleine","sex":"Goran Bregović","sexual":"Amber","shake":null,"share":"Barry White","she":"Harry Connick, Jr.","shoot":null,"short":"Japanese Porn","shot":"Limp Bizkit","should":"Over the Rhine","shoulder":"Timber","show":"Pickled Dogg","side":null,"sign":"Sign of the Times","significant":"Drew Bunting","similar":"Cassia","simple":"k.d. lang","simply":"Michael Bolton","since":"Roachford","sing":null,"single":"Bad Astronaut","sit":"Four Carry Nuts","situation":"Tom Jones","sister":"Indigo Girls","site":"Cane","six":null,"size":"The Beautiful South","skill":"Boyracer","skin":null,"small":"Cristian Vogel","smile":"Télépopmusik","so":"spotify:track:5rbGFp3wbk0kndmxZbTaoq","social":"Squirtgun","society":"Pennywise","soldier":"Steven Curtis Chapman","some":"Binder","somebody":"Caater","someone":"Nancy Wilson","something":"Sarah Vaughan","sometimes":"Rivets","son":"Golden Smog","song":"L.S.U.","soon":"Patrick Moraz","sort":"Quartier Latin Academia","sound":"Moby","source":"Unit Moebius","south":"Alpha","southern":"Orchestral Manoeuvres in the Dark","space":"New Model Army","speak":"Nickel Creek","special":"Violent Femmes","specific":"Sweet Slag","speech":"Keziah Jones","stand":"Rebecca St. James","stage":"Michael Land","state":"Headstrong","star":null,"spring":"Richard Shindell","spend":"ROT","step":null,"station":null,"staff":"Erhard Hirt","sport":"The Bonzo Dog Band","standard":"Frank Jordan","statement":"Heiter bis Wolkig","start":"C‐Murder","still":null,"stay":"Swan Lee","strong":"Rev. Ernest Davis, Jr.'s Wilmington Chester Mass Choir","structure":"Art of Noise","student":"Turtle Bay Country Club","study":"Susan Drake","stuff":"Diamond Rio","style":"Enuff Z’Nuff","subject":"John Mayer","success":"Jodeci","successful":"Matt Keating","such":"Ernst und Heinrich","suddenly":"Gala","suffer":"Moev","suggest":"BOYFRIEND","support":"In Cold Blood","task":"Tilman Ehrhorn","teach":"Rudy + Blitz","table":"Fuck","system":"Force Legato","take":"Riddlin’ Kids","tax":"Raw Power","teacher":"Burning Spear","surface":"By a Thread","talk":null,"team":"Broterhood Foundation","sure":"Regia","summer":"Sum 41","technology":"Dynamix II","test":"Hard‐Ons","than":"Barem","thank":"Rebecca Coupe Franks","that":null,"the":"Dirty Oppland","their":"K Nogami","them":"Galaxie 500","themselves":"Minutemen","then":"The Vogues","theory":"Gundog","there":"spotify:track:0tplA2Isqr8NUvTroTXijV","these":"Gerald Levert","thousand":"Razed in Black","they":"Goodbye Harry","throughout":"Bill Frisell","through":"Electric Company","thought":"Propaganda","third":"Darkane","those":"Coughee Brothaz","think":"James Brown and his Famous Flames","threat":"Against All Authority","throw":"Paperclip People","this":"Chad Brock","though":"Delaware","three":null,"thing":"Shame Idols","thus":"The Tape-beatles","too":"Stéphane Picq","top":"The Bran Flakes","total":"Patricia Gamero","tough":"Kurtis Blow","toward":"Spool","town":"Northern Uproar","trade":"Lisa Miller","traditional":"Rorschach","training":"Mark Knopfler","travel":"Longpigs","treat":"Strict","treatment":"ZAZAZ","tree":"Pond","trial":"Verbal Assault","under":"Planet Mosquito","until":"Joydrop","true":"The Benjamin Gate","turn":null,"truth":"Hue & Cry","TV":"Jesse James","unit":"Logic System","type":"Living Colour","understand":"Eric’s Trip","try":null,"up":null,"trip":"Nils Petter Molvær","trouble":null,"two":null,"very":"Rework","victim":"EC8OR","view":"De La Soul","violence":"Mott the Hoople","visit":"Biosphere","voice":"This Day Forward","vote":"Itä‐Saksa","wait":"KieTheVez","walk":null,"wall":"John Cale","want":"Recoil","war":null,"weight":"Sarah Slean","when":"Shania Twain","western":"Belgian Asociality","weapon":"Six Finger Satellite","whatever":"Pitchshifter","wear":"Christ Analogue","we":"Silence 4","week":"The Bloody Hawaiians","well":null,"way":"Go Robot, Go!","west":"Craig Linder","watch":"The Call","what":"Eve","water":"moe.","where":"Domestic Problems","whole":"Flaw","whom":"Kettel","whose":"森沢洋介","why":null,"wide":"Carolyn Evans","wife":"Phil Ranelin","will":"Kevin Salem","win":"Paco Sery","wind":"Der Dritte Raum","window":"Guster","wish":"The Fixx","with":"Alpha","within":"At the Gates","without":"Lacrimas Profundere","woman":null,"wonder":"Eric’s Trip","word":"Very Large Array","work":"Masters at Work","worker":"Confuse","world":"Felt","worry":"Public Image Ltd.","would":"Family Fodder","write":"THE RODEO CARBURETTOR","writer":"T.I.","wrong":"Sister Machine Gun","yard":"Biosphere","yeah":null,"year":"The Semibeings","yes":null,"yet":"Angry Hill","you":null,"young":"Nickel Creek","your":"Jah Mali","yourself":"dISHARMONY", "to":"spotify:track:2YXpMdEMEoy48OPr6VTzpI", "are":"spotify:track:0L6WRMANsYoX1mIe25zwbe", "hi":"spotify:track:2XKwOfTbvLYN959bEGkjJ7"}];
		const keys = Object.keys(topWordSongs[0]);
		let topWordSongsWithUris = {};
		window.topWordSongsWithUris = topWordSongsWithUris;
		let promises = [];
		for(let trackName in topWordSongs[0]){
			let promise = new Promise((resolve, reject) => {
				setTimeout(async () => {
					if(topWordSongs[0][trackName]){
						console.log("SEARCH: track: " + trackName + ", artist: " + topWordSongs[0][trackName]);
						let retriedSearch = false;
						let apiResults = await searchAPI(trackName, 0, topWordSongs[0][trackName]);
						if(apiResults.length == 0){
							console.log("==== TRACK SEARCH: " + trackName + " ======= ");
							apiResults = await searchAPI(trackName, 0, null);
							retriedSearch = true;
						}
						for (let j = 0; j < apiResults.length; j++) {
							// console.log(apiResults[j].name.toUpperCase() == trackName.toUpperCase());
							let strippedAPIresults = apiResults[j].name.split('(')[0].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/['"]+/g, '').toUpperCase();
							let strippedTrackName = trackName.split('(')[0].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/['"]+/g, '').toUpperCase();
			
							if (strippedAPIresults == strippedTrackName) {
								const uri = apiResults[j].uri;
								topWordSongsWithUris[trackName] = uri;
								console.log(trackName + ": " + uri);
								break;
							} else if(!retriedSearch) {
								console.log("==== Track search for: " + trackName + " ======= ");
								let trackApiResults = await searchAPI(trackName, 0, null);
								for (let n = 0; n < trackApiResults.length; n++) {
									let strippedtrackAPIresults = trackApiResults[n].name.split('(')[0].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/['"]+/g, '').toUpperCase();
									if (strippedtrackAPIresults == strippedTrackName) {
										const uri = trackApiResults[n].uri;
										topWordSongsWithUris[trackName] = uri;
										console.log(trackName + ": " + uri);
										break;
									} else if (n == apiResults.length - 1) {
										topWordSongsWithUris[trackName] = null;
									}
								}
							} else {
								topWordSongsWithUris[trackName] = null;
							}
						}
					} else {
						topWordSongsWithUris[trackName] = null;
					}
				}, keys.indexOf(trackName) * 600); // Delay each call to searchAPI by i * 1200ms
			});
			window.topWordSongsWithUris = topWordSongsWithUris;
			promises.push(promise);
			// if (keys.indexOf(trackName) > 3) { break }
		}
		Promise.all(promises).then(() => {
			window.topWordSongsWithUris = topWordSongsWithUris;
			console.log(topWordSongsWithUris);
			console.log(JSON.stringify(topWordSongsWithUris));
		}).catch((error) => {
			console.error("Error:", error);
		});
	}


	function checkMatch(apiResults, wordGrouping) {
		for (let i = 0; i < apiResults.length; i++) {
			let track = apiResults[i];
			let strippedTrackName = track.name.split('(')[0].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/['"]+/g, '').replace(/[^\w\s]|_/g, '').replace(/\./g, '').toUpperCase();
			let strippedWordGrouping = wordGrouping.split('(')[0].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/['"]+/g, '').replace(/[^\w\s]|_/g, '').replace(/\./g, '').toUpperCase();
			if(strippedTrackName == strippedWordGrouping){
				return track;
			}
		}
		return null;
	}

	async function createPlaylistAPI(name) {
		const endpointURL = 'https://api.spotify.com/v1/users/' + localStorage.getItem('spotifyId') + '/playlists';
		try {
			const spotifyResponse = await spotifyAxios.post(endpointURL, {
				'name': name.substring(0, 199),
				'public': true
			});
			if (spotifyResponse.status >= 200 && spotifyResponse.status < 300) {
				localStorage.setItem('spotifyPlaylistId', spotifyResponse.data.id);
				localStorage.setItem("playlistId", spotifyResponse.data.id);
				// const internalResponse = await internalAxios.post('http://localhost:8000/api/playlists', {
				// 	'spotify_playlist_id': spotifyResponse.data.id,
				// 	'owner': localStorage.getItem('spotifyId'),
				// 	'members': [],
				// 	'tracks': []
				// });
				return spotifyResponse.data.id;
				// window.location.href = '/playlist/' + spotifyResponse.data.id;
			} else {
				console.log('Error creating playlist');
			}
		} catch (error) { }
	}

	async function addToPlaylistAPI(tracks, playlistId) {
		const endpointURL = 'https://api.spotify.com/v1/playlists/' + playlistId + '/tracks';
		let trackUris = [];
		for (let i = 0; i < tracks.length; i++) {
			trackUris[i] = tracks[i].uri;
		}
		try {
			const spotifyResponse = await spotifyAxios.post(endpointURL,{
				'uris': trackUris
			});
			// if (spotifyResponse.status >= 200 && spotifyResponse.status < 300) {
			// 	const internalResponse = await internalAxios.post('http://localhost:8000/api/playlists/'+playlistId+'/tracks', {
			// 		'spotify_playlist_id': playlistId,
			// 		'curator': localStorage.getItem('spotifyId'),
			// 		'track_id': track.id
			// 	});
			// } else {
			// 	console.log('Error adding track to playlist');
			// }
		} catch (error) {}
	}

	async function searchAPI(trackName, offset, artist) {
		let searchQuery = "";
		if(artist == null){
			searchQuery = trackName.replace(/\s/g, '+');
		} else {
			searchQuery = "%20track:" + trackName.replace(/\s/g, '+') + "%20artist:" + artist.replace(/\s/g, '+');
		}
		const endpointURL =
			'https://api.spotify.com/v1/search?q=' + searchQuery + '&type=track' + '&limit=50' + '&type=track' + '&offset=' + offset;
		let tmpResultsArray = [];
		try {
			const response = await spotifyAxios.get(endpointURL, {
				name: 'Song Pong Playlist',
				public: true,
			});
			return response.data.tracks.items;
			// setSearchResultsData(response.data.tracks.items);
		} catch (error) { }
	}

	return (
		<main>
			{/* Premium upsell */}
			<div className={showPremium && !premiumFail ? "premiumWrapper" : "premiumWrapper hidden"}>
				<div className="premiumDialog">
					<h1>Upgrade to PREMIUM to keep typing!</h1>

					<p>Feed the monkey to upgrade. BUT. DON'T TEASE HIM. HE'S HUNGRY.</p>
					<img src={process.env.PUBLIC_URL + "/premiummonkey.jpg"} alt="premium monkey" width="200" />
					<div className="feedButtons">
						<button className="premiumButton" onClick={premiumFailClick}>Feed 1 bananas</button>
						<button className="premiumButton" onClick={premiumFailClick}>Feed 5 bananas</button>
						<button className="premiumButton" onClick={premiumSuccessClick}>Feed 20 bananas</button>
					</div>
				</div>
			</div>
			{/* Premium fail  */}
			<div className={showPremium && premiumFail ? "premiumWrapper" : "premiumWrapper hidden"}>
				<div className="premiumDialog">
					<h1>Not enough bananas wtf</h1>
					<img src={process.env.PUBLIC_URL + "/premiumfail.jpg"} alt="premium monkey" width="200" />
					<div className="feedButtons">
						<button className="premiumButton" onClick={premiumFailClick}>Feed 1 bananas</button>
						<button className="premiumButton" onClick={premiumFailClick}>Feed 5 bananas</button>
						<button className="premiumButton" onClick={premiumSuccessClick}>Feed 20 bananas</button>
					</div>
				</div>
			</div>
			{/* Premium success */}
			<div className={showPremium && premiumSuccess ? "premiumWrapper" : "premiumWrapper hidden"}>
				<div className="premiumDialog">
					<h1>He's so happy thank u</h1>
					<img src={process.env.PUBLIC_URL + "/premiumsuccess.jpg"} alt="premium monkey" width="200" />
					<button className="premiumButton" onClick={closePremiumDialog}>Close</button>
				</div>
			</div>
			<div className={!generating ? "mainPadding" : "mainPadding hidden"}>
				<div className="mainWrapper">
					<div className={generating ? "editor hidden" : "editor"}>
						<h1 className="logo">Playlist Gen <span className="faded">(.com)</span></h1>
						<p><span className="emoji">✍️</span>Type your deepest darkest thoughts and hit generate.</p> 
						<p><span className="emoji">🎶</span>I'll create a Spotify playlist in your account for whatever you type.</p>
						<p><span className="emoji">😒</span>It's not perfect ok?</p>

						<form onSubmit={submitSearch} className="searchBar">
							<input
								type="text"
								placeholder="be unhinged here"
								autoFocus
								id="searchQuery"
								value={inputValue}
								onChange={handleChange}
								maxLength="199"
							/>
							<input type="submit" className="search" value="Go"></input>
						</form>
						<p className={!tooLong ? "hidden" : undefined}>Fewer than 200 characters pls</p>
						{/* <button onClick={createPlaylistAPI}>Create playlist</button>
						<button onClick={queryMusicBrains}>Query music brainz</button>
						<button onClick={getURIs}>Query Spotify for URIs</button> */}
					</div>
				</div>
			</div>
			<div className={generating ? "repeatingGenContainerContainer" : "repeatingGenContainerContainer hidden"}>
				<div className="repeatingGenContainer">
					{(() => {
						let td = [];
						let x = Math.round(window.innerHeight / 30);
						for (let i = 1; i <= x; i++) {
							let delay = Math.random() * 7000; //(3000 / 20) * i * ;
							td.push(<h2 key={i} className='generatingHeader' style={{animationDelay:delay + "ms"}}>Generating...</h2>);
						}
						return td;
					})()}
				</div>
				
				<div className="repeatingGenContainer">
					{(() => {
						let td = [];
						let x = Math.round(window.innerHeight / 30);
						for (let i = 1; i <= x; i++) {
							let delay = Math.random() * 7000; //(3000 / 20) * i * ;
							td.push(<h2 key={i} className='generatingHeader' style={{animationDelay:delay + "ms"}}>Generating...</h2>);
						}
						return td;
					})()}
				</div>
				
				<div className="repeatingGenContainer">
					{(() => {
						let td = [];
						let x = Math.round(window.innerHeight / 30);
						for (let i = 1; i <= x; i++) {
							let delay = Math.random() * 7000; //(3000 / 20) * i * ;
							td.push(<h2 key={i} className='generatingHeader' style={{animationDelay:delay + "ms"}}>Generating...</h2>);
						}
						return td;
					})()}
				</div>
				
				<div className="repeatingGenContainer">
					{(() => {
						let td = [];
						let x = Math.round(window.innerHeight / 30);
						for (let i = 1; i <= x; i++) {
							let delay = Math.random() * 7000; //(3000 / 20) * i * ;
							td.push(<h2 key={i} className='generatingHeader' style={{animationDelay:delay + "ms"}}>Generating...</h2>);
						}
						return td;
					})()}
				</div>
				
				<div className="repeatingGenContainer">
					{(() => {
						let td = [];
						let x = Math.round(window.innerHeight / 30);
						for (let i = 1; i <= x; i++) {
							let delay = Math.random() * 7000; //(3000 / 20) * i * ;
							td.push(<h2 key={i} className='generatingHeader' style={{animationDelay:delay + "ms"}}>Generating...</h2>);
						}
						return td;
					})()}
				</div>
				
				<div className="repeatingGenContainer">
					{(() => {
						let td = [];
						let x = Math.round(window.innerHeight / 30);
						for (let i = 1; i <= x; i++) {
							let delay = Math.random() * 7000; //(3000 / 20) * i * ;
							td.push(<h2 key={i} className='generatingHeader' style={{animationDelay:delay + "ms"}}>Generating...</h2>);
						}
						return td;
					})()}
				</div>
				
			</div>
		</main>
	);
}