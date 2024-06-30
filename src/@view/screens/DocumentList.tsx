import { MdAdd, MdChevronLeft, MdChevronRight } from 'react-icons/md';

import router from 'next/router';
import classNames from 'classnames';

//#region old hook
import { useDocument } from '@/hook/document';
import { IDocumentFormData } from '@/hook/document/types/DocumentFormData';
import { DOCUMENT_BLOCK_INITIALS } from '@/hook/document/wrapper';
//#endregion

import { Button } from '../components/Button';
import { Nav } from '../components/Nav';
import { useDocumentList } from './useDocumentList';

export function DocumentList() {
  const { documents, page } = useDocumentList();

  const oldHook = useDocument();

  const pushEditorPage = (item: IDocumentFormData) => {
    oldHook.startEditor(item);
    router.push('/documents/editor');
  };

  function handleCreate() {
    pushEditorPage(DOCUMENT_BLOCK_INITIALS);
  }

  function handleEdit(documentId: string) {
    const findedDoc = oldHook.documents.find(doc => doc.id === documentId);

    if (!findedDoc) return;

    pushEditorPage(findedDoc);
  }

  const isListEmpty = documents.length === 0;

  return (
    <div className="flex max-h-screen">
      <Nav />

      <div className="flex flex-col flex-1 min-h-full">
        <header className="py-4 px-6 flex justify-between items-center border-b border-accent-2 shadow-sm">
          <h2 className="font-merriweather font-bold text-xl">Documentos</h2>

          {!isListEmpty && (
            <Button
              id="add-document"
              variant="outline"
              size="sm"
              leftIcon={MdAdd}
              onClick={handleCreate}
            >
              Adicionar
            </Button>
          )}
        </header>

        <main className="flex flex-col flex-1 gap-y-3 overflow-y-scroll no-scroll p-4">
          {!isListEmpty && (
            <>
              <ul className="flex flex-col gap-y-2 w-full">
                {documents.map(document => (
                  <li key={document.id}>
                    <button
                      type="button"
                      onClick={() => handleEdit(document.id)}
                      className={classNames(
                        'flex items-center',
                        'w-full px-3 py-1 rounded hover:bg-accent-1 transition text-left',
                        'border border-accent-2 h-12',
                      )}
                    >
                      <strong className="text-accent-6 font-medium">
                        {document.title}
                      </strong>

                      {/* <div className="ml-auto">
                    <button
                      type="button"
                      className={classNames(
                        'px-2 py-2 text-red font-medium z-10',
                      )}
                    >
                      Deletar
                    </button>
                  </div> */}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mx-auto flex gap-x-2">
                <button
                  type="button"
                  className="h-10 w-10 p-2 border border-accent-2 hover:bg-accent-1 rounded transition"
                  onClick={() => page.previous()}
                >
                  <MdChevronLeft size={24} />
                </button>

                <div className="h-10 w-10 p-2 text-center font-bold select-none rounded transition">
                  <span>{page.state + 1}</span>
                </div>

                <button
                  type="button"
                  className="h-10 w-10 p-2 border border-accent-2 hover:bg-accent-1 rounded transition"
                  onClick={() => page.next()}
                >
                  <MdChevronRight size={24} />
                </button>
              </div>
            </>
          )}

          {isListEmpty && (
            <div className="flex flex-col flex-1 justify-center items-center gap-y-4">
              <p>Nenhum documento ainda</p>
              <Button
                id="add-document"
                variant="outline"
                size="sm"
                leftIcon={MdAdd}
                onClick={handleCreate}
              >
                Adicionar
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
