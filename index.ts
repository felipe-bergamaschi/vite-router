import { PluginOption } from 'vite';

export function viteRouter(): PluginOption {
  return {
    name: 'vite-plugin-router',

    configResolved(config) {
      const plugins = config.plugins.map((plugin) => plugin.name);
      console.log(`Your project has ${plugins.length} Vite plugins.`);
      console.table(plugins);
    },
  }
}
