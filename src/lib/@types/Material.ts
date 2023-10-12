import type { ITitle } from "./interfaces/ITitle";

interface IMaterial {
  _id?: string;
  active?: boolean;
}

export interface IMaterialGet extends IMaterial {
  titleList: ITitle[];
  code?: string;
}

export interface IMaterialPost extends IMaterial {
  titleList: ITitle[];
  code?: string;
}

export interface IMaterialDTO extends IMaterial {
  titleList: ITitle[];
  code?: string;
}

export interface IMaterialForm extends IMaterial {
  title?: string;
  code?: string;
}

export class MaterialForm implements IMaterialForm {
  _id?: string;
  active?: boolean;
  title?: string;
  code?: string;

  constructor(
    material: IMaterialForm | undefined = {
      _id: "",
      active: true,
      title: "",
      code: "",
    }
  ) {
    this._id = material._id;
    this.active = material.active;
    this.title = material.title;
    this.code = material.code;
  }
}

export class MaterialFormUpdate implements IMaterialForm {
  _id?: string;
  active?: boolean;
  title?: string;
  code?: string;

  constructor(material?: IMaterialForm) {
    this._id = material?._id;
    this.active = material?.active;
    this.title = material?.title;
  }
}
