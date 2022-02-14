import { ResponseCreateTransacaoContaDto } from "./response-create-transacao-conta.dto copy";
import { ResponseCreateTransacaoTransacaoDto } from "./response-create-transacao-transacao.dto copy 2";

export class ResponseCreateTransacaoDto {
    transacao: ResponseCreateTransacaoTransacaoDto
    conta: ResponseCreateTransacaoContaDto
}
