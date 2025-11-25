from kivy.app import App
from kivy.uix.screenmanager import ScreenManager

from ui.screens import HomeScreen
from core.config import AppConfig
from core.state_manager import GlobalState

class NyxtheraApp(App):
    def build(self):
        self.title = "Nyxthera"
        self.config = AppConfig()
        self.state = GlobalState()

        sm = ScreenManager()
        sm.add_widget(HomeScreen(name="home"))
        return sm


if __name__ == "__main__":
    NyxtheraApp().run()