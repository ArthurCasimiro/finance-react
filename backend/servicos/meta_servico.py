from modelos.financeiro import Meta
from repositorios.meta_repositorio import MetaRepositorio

repositorio = MetaRepositorio()


def listar_metas(usuario_id):
    metas = repositorio.listar_por_usuario(usuario_id)
    return [_serializar(m) for m in metas]


def criar_meta(usuario_id, nome, valor_alvo):
    if not nome or not valor_alvo:
        return None, "Todos os campos são obrigatórios"

    try:
        valor_float = float(valor_alvo)
        if valor_float <= 0:
            return None, "O valor alvo deve ser maior que zero"
    except ValueError:
        return None, "Valor inválido"

    meta = Meta(
        nome=nome,
        valor_alvo=valor_float,
        valor_atual=0.0,
        usuario_id=usuario_id
    )
    repositorio.salvar(meta)
    return _serializar(meta), None


def depositar_meta(meta_id, usuario_id, valor):
    meta = repositorio.buscar_por_id(meta_id, usuario_id)
    if not meta:
        return None, "Meta não encontrada"

    try:
        valor_float = float(valor)
        if valor_float <= 0:
            return None, "O valor deve ser maior que zero"
    except (ValueError, TypeError):
        return None, "Valor inválido"

    novo_valor = min(meta.valor_atual + valor_float, meta.valor_alvo)
    repositorio.atualizar_valor(meta, novo_valor)
    return _serializar(meta), None


def excluir_meta(meta_id, usuario_id):
    meta = repositorio.buscar_por_id(meta_id, usuario_id)
    if not meta:
        return None, "Meta não encontrada"
    repositorio.excluir(meta)
    return True, None


def _serializar(meta):
    return {
        "id": meta.id,
        "nome": meta.nome,
        "valor_alvo": meta.valor_alvo,
        "valor_atual": meta.valor_atual,
        "percentual": meta.percentual()
    }
