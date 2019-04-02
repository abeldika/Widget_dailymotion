class dailymotionWidget extends Widget {
	
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
		this.link = HH.create("a");
		SS.style(this.link, {"fontSize": "10px", "textDecoration": "none"});
		this.stage.appendChild(this.link);
		
		this.try.footer.innerHTML = "test of Daily Search";
		SS.style(this.try.footer, {"userSelect": "none", "cursor": "pointer"});
		Events.on(this.try.footer, "click", event => this.mvc.controller.socketClick());
		this.try.stage.appendChild(this.try.footer);
	}
	
	update(title, link) {
		this.link.innerHTML = title;
		HH.attr(this.link, {"href": "http://www.dailymotion.com" + link, "target": "_blank"});
	}
	
}

class LeMondeController extends WidgetController {
	
	constructor() {
		super();
	}
	
	setUp() {
		super.setUp();
		
	}
	
	onMessage(data) {
		trace("received socket msg", data);
	}
	
	socketClick(event) {
		trace("Test soket");
		SocketIO.send("msg", {test: "message"});
	}
	
	async load() {
		let result = await this.mvc.main.dom("http://www.dailymotion.com/videos "); // load web page
		let domstr = _atob(result.response.dom); // decode result
		let parser = new DOMParser(); // init dom parser
		let dom = parser.parseFromString(domstr, "text/html"); // inject result
		let search = new xph().doc(dom).ctx(dom).craft('//*[@id="search"]').firstResult; // find interesting things
		this.mvc.view.update(article.textContent, article.getAttribute("href"));
	}
	
}