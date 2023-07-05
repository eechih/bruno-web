import logger from '@/lib/logger'

export class AmigoClass {
  private _config = {}
  private _components: any[] = []
  private _modules: Record<string, any> = {}

  Auth = null
  API = null
  Credentials = null
  Storage = null

  register(component: any) {
    logger.debug('component registered in amigo', component)
    this._components.push(component)
    if (typeof component.getModuleName === 'function') {
      this._modules[component.getModuleName()] = component
      switch (component.getModuleName()) {
        case 'Auth':
          this.Auth = component
          break
        case 'API':
          this.API = component
          break
        case 'Credentials':
          this.Credentials = component
          break
        case 'Storage':
          this.Storage = component
          break
      }
    } else {
      logger.debug('no getModuleName method for component', component)
    }

    component.configure(this._config)
  }

  configure(config?: any) {
    if (!config) return this._config
    this._config = Object.assign(this._config, config)
    logger.debug('amigo config', this._config)

    this._components.map(comp => {
      comp.configure(this._config)
    })

    return this._config
  }
}

export const Amigo = new AmigoClass()
