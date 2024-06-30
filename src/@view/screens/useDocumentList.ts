import { DocumentListed } from '@/@domain/entities/Document';
import { Usecases } from '@/@domain/usecases/Usecases';
import { format } from 'date-fns';
import { useEffect, useRef, useState } from 'react';

const ITEMS_PER_PAGE = 10;

type Document = {
  id: string;
  title: string;
  createdDate: string;
};

export function useDocumentList() {
  const [page, setPage] = useState(0);
  const enableNext = useRef(true);
  const enablePrev = useRef(true);
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    async function run() {
      const { result } = await Usecases.document.list.execute({
        page,
        itemsPerPage: ITEMS_PER_PAGE,
      });

      if (result.type === 'ERROR') {
        alert('Falha ao buscar documentos');
        return;
      }

      setDocuments(
        result.payload.data.map(i => ({
          id: i.id,
          title: i.title,
          createdDate:
            i === null
              ? '-'
              : `Criado há ${format(i.createdDate, 'dd/MM/yyyy')}`,
        })),
      );
      enableNext.current = result.payload.enableNext;
      enablePrev.current = result.payload.enablePrev;
    }

    run();
  }, [page]);

  function nextPage() {
    if (enableNext.current) setPage(pg => pg + 1);
  }
  function previousPage() {
    if (enablePrev.current) setPage(pg => pg - 1);
  }

  return {
    documents,
    page: {
      state: page,
      next: nextPage,
      previous: previousPage,
    },
  };
}
