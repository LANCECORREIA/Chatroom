from channels.generic.websocket import AsyncWebsocketConsumer
import json


class ChatRoomConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = "chat_" + self.room_name
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name,
        )

        # accepts incoming ws connections
        await self.accept()

        # await self.channel_layer.group_send(
        #     self.room_group_name,
        #     {
        #         "type": "tester_message",
        #         "tester": "hello world",
        #     },
        # )

    # # should be same as type
    # async def tester_message(self, event):
    #     tester = event["tester"]
    #     await self.send(
    #         text_data=json.dumps(
    #             {
    #                 "tester": tester,
    #             }
    #         )
    #     )

    async def disconnect(self, code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name,
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)

        message = text_data_json["message"]
        name = text_data_json["name"]
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message,
                "name": name,
            },
        )

    async def chat_message(self, event):
        await self.send(
            text_data=json.dumps(
                {
                    "message": event["message"],
                    "name": event["name"],
                }
            )
        )
