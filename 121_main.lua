-- Pull in the wezterm API
local wezterm = require 'wezterm'

-- This will hold the configuration.
local config = wezterm.config_builder()

wezterm.on('gui-startup', function(cmd)
  wezterm.mux.spawn_window({
    args = {
      "bun",
      "run",
      "*****.ts",
    },
     position = {
      x = 20,
      y = 20,
    },
  })
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

config.window_frame = {
  inactive_titlebar_bg = '#353535',
  --active_titlebar_bg = '#2b2042',
  active_titlebar_bg = '#ffffff',
  inactive_titlebar_fg = '#cccccc',
  active_titlebar_fg = '#ffffff',
  inactive_titlebar_border_bottom = '#2b2042',
  active_titlebar_border_bottom = '#2b2042',
  button_fg = '#cccccc',
  button_bg = '#2b2042',
  button_hover_fg = '#ffffff',
  button_hover_bg = '#3b3052',
}
-- Finally, return the configuration to wezterm:
return config