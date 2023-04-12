import * as Schema from "./JSONSchema";
import { Icon, LayerGroup } from "leaflet";
import { ZDMarker } from "./ZDMarker";

export enum Visibility {
  Off,
  On,
  Default,
}

export class Layer extends LayerGroup {
  public icon?: L.Icon;
  public infoSource: string;

  public minZoom = 0;
  public maxZoom = Number.MAX_VALUE;
  public visibility = Visibility.Default;
  public markers!: ZDMarker[]; // BUGBUG refactor to avoid having to suppress null checking

  private constructor(infoSource: string) {
    super();
    this.infoSource = infoSource;
  }

  public static fromJSON(
    json: Schema.Layer,
    infoSource: string,
    directory: string
  ): Layer {
    const layer = new Layer(infoSource);

    if (json.icon) {
      layer.icon = new Icon({
        iconUrl: `${import.meta.env.BASE_URL}${directory}/icons/${
          json.icon.url
        }`, // TODO find a better way to get directory
        iconSize: [json.icon.width, json.icon.height],
      });
    }

    if (json.minZoom != undefined) {
      layer.minZoom = json.minZoom;
    }
    if (json.maxZoom != undefined) {
      layer.maxZoom = json.maxZoom;
    }

    layer.markers = json.markers.map((m) => ZDMarker.fromJSON(m, layer));

    return layer;
  }

  public getIconUrl(): string {
    return (this.icon && this.icon.options.iconUrl) || "";
  }

  public getIconWidth(): number {
    return (this.icon && (<L.PointTuple>this.icon.options.iconSize)[0]) || 0;
  }

  public getMinZoom(): number {
    return this.minZoom;
  }

  public forceShow(): void {
    this.setVisibility(Visibility.On);
  }

  public forceHide(): void {
    this.setVisibility(Visibility.Off);
  }

  public resetVisibility(): void {
    this.setVisibility(Visibility.Default);
  }

  private setVisibility(visibility: Visibility): void {
    this.visibility = visibility;
  }
}
