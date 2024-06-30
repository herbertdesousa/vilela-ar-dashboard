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

  createdDate: Date | null;

  static fromModel(model: DocumentModel) {
    const entity = new DocumentListed();
    entity.id = model.id;
    entity.title = model.title;
    entity.createdDate = null;

    // eslint-disable-next-line no-restricted-syntax
    for (const lay of model.layers) {
      if (lay.type === 'header') {
        entity.createdDate = lay.date;

        break;
      }
    }

    return entity;
  }
}
