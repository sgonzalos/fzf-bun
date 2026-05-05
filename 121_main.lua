-- Pull in the wezterm API
local wezterm = require 'wezterm'

-- This will hold the configuration.
local config = wezterm.config_builder()

wezterm.on('gui-startup', function(cmd)
  local tab, pane, window = wezterm.mux.spawn_window(cmd or{})
  window:gui_window():set_position(50, 50)
end)
-- This is where you actually apply your config choices.

-- For example, changing the initial geometry for new windows:
config.initial_cols = 200
config.initial_rows = 50

config.font = wezterm.font "Roroit BS"

-- or, changing the font size and color scheme.
config.font_size = 12
-- config.color_scheme = 'AdventureTime'
config.window_background_opacity = 0.95

config.hide_tab_bar_if_only_one_tab = true

config.window_background_gradient = {
  orientation = 'Vertical',
  colors = {
    '#0f0c29',
    '#302b63',
    '#24243e',
  },
  interpolation = 'Linear',
  blend = 'Rgb',
}
--config.window_decorations = "RESIZE"

-- Finally, return the configuration to wezterm:
return config