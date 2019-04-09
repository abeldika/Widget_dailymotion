class DailymotionWidget extends Widget {
	
	constructor(id, app) {
		super(id, DailymotionModel, DailymotionView, DailymotionController, app);
	}
	
	setUp() {
		super.setUp();
		this.header = true;
		this.footer = true;
		this.sizeX = 8;
		this.sizeY = 4;
		this.radius = 15;
	}
	
	async ready() {
		super.ready();
		SocketIO.initialize();
		trace(this);
		SocketIO.on("msg", this.mvc.controller.onMessage.bind(this));
		this.mvc.controller.load();
	}
	
}

class DailymotionModel extends WidgetModel {
	
	constructor() {
		super();

		this.url = ["htpps://www.Dailymotion.com/search?q={0}"] ;
	}
	
	setUp() {
		super.setUp();
		
	}

}

class DailymotionView extends WidgetView {
	
	constructor() {
		super();
	}
	
	setUp() {
		super.setUp();
		
	}

	draw() {
		super.draw();
		this.try = HH.create("input");
		this.try.searchBar.setAttribute("type", "text");
        this.try.searchBar.setAttribute("placeholder", "Rechercher...");
		SS.style(this.searchBar, {"width": "85%", "border-radius": "10px", "padding": "2px", "margin": "5px"});
		Events.on(this.try.searchBar, "keydown", event => this.try.mvc.controller.keyDownSearchBar(event));
        this.try.stage.appendChild(this.try.searchBar);

        this.try.autocompletionResults = HH.create("div");
        this.try.stage.appendChild(this.try.autocompletionResults);
	}

	//* integration de l'api  du player Dailymotion et le parametre permettant de jouer la prochaine video


	var player = DM.player(document.getElementById('player'), {
		video: 'xwr14q'
	});

	var handleAPIReponse = function(response) {
		var videos = response.list;
		var player = DM.player(document.getElementById('player'),{

		});

		player.addEventListener('end',function (e)

		{
			var nextvideo = videos.shift();
			if(nextvideo){
				e.target.load(nextvideo.id);


			}

		});
		});
	}

	
}

class DAilymotionController extends WidgetController {
	
	constructor() {
		super();
	}
	
	setUp() {
		super.setUp();
		
	}
	
	async keyDownSearchBar(e) {

		
		await this.try.getAutocompletionResults(this.try.mvc.view.searchBar.value);

		if(e.keyCode == 13) //Si on appuie sur entrer...
			this.try.openTabsResults(this.try.mvc.view.searchBar.value);

	}

	openTabsResults(result) {
		for(let i = 0; i < this.try.mvc.model.url.length; i++) {
			window.open(this.try.mvc.model.url[i].replace("{0}", result), '_blank');
		}
	}
	
	async getAutocompletionResults(search) {
		let json = await this.mvc.main.dom("https://api.dailymotion.com/api/suggest/?q=" + search + "&client=opensearch&lang=fr_fr");
		let jsonParsed = JSON.parse(atob(json.response.dom));
		let results = [];

		for(let i = 0; i < jsonParsed[1].length; i++) {
			let div = document.createElement("div"), text = document.createElement("p");

			div.style.cursor = "pointer";
			div.style.paddingLeft = "5px";
			div.style.paddingRight = "5px";
			text.innerText = jsonParsed[1][i];
			div.appendChild(text);

			div.addEventListener("click", event => { this.try.openTabsResults(jsonParsed[1][i]) });
			results.push(div);
		}

		this.try.mvc.view.autocompletionResults.innerHTML = "";
		for(let i = 0; i < results.length; i++) {
			this.try.mvc.view.autocompletionResults.appendChild(results[i]);
		}
	}
}