import { DocumentModel } from '@/@data/models/DocumentModel';

export class Document {
  id: string;

  type: string;

  title: string;

  addBankDetailsPage: boolean;
}

export class DocumentListed {
  id: string;

  title: string;

  // createdDate: Date;

  static fromModel(model: DocumentModel) {
    const entity = new DocumentListed();
    entity.id = model.id;
    entity.title = model.title;
    return entity;
  }
}
