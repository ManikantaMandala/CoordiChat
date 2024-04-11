import { WebSocket ,WebSocketServer } from "ws";
import express from "express";

const app = express();

app.get("/", (req, res) => {
	res.send("Hello World!");
});

const httpServer = app.listen(8080, () => {
	console.log("Server is running on port 8080");
});

const wss = new WebSocketServer({server: httpServer});

wss.on("connection", (ws)=>{
	ws.on("error", (x)=>{
		console.error(x);
	});
	ws.on("open", ()=>{
		ws.send("Hello from server!");
		console.log(wss.clients);
	});
	ws.on("message", (data, isBinary)=>{
		console.log(data, isBinary);
		wss.clients.forEach((client)=>{
			console.log(client, client.readyState);
			if(client !== ws && client.readyState === WebSocket.OPEN){
				client.send(data, {binary: isBinary});
			}
		});
	})
})
