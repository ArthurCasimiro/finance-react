from datetime import datetime
from modelos.financeiro import Conta
from repositorios.conta_repositorio import ContaRepositorio

repositorio = ContaRepositorio()


def listar_contas(usuario_id):
    contas = repositorio.listar_por_usuario(usuario_id)
    return [_serializar(c) for c in contas]


def criar_conta(usuario_id, descricao, valor, vencimento_str):
    if not descricao or not valor or not vencimento_str:
        return None, "Todos os campos são obrigatórios"

    try:
        valor_float = float(valor)
        if valor_float <= 0:
            return None, "O valor deve ser maior que zero"
    except ValueError:
        return None, "Valor inválido"

    try:
        vencimento = datetime.strptime(vencimento_str, "%Y-%m-%d").date()
    except ValueError:
        return None, "Data inválida. Use o formato AAAA-MM-DD"

    conta = Conta(
        descricao=descricao,
        valor=valor_float,
        vencimento=vencimento,
        usuario_id=usuario_id
    )
    repositorio.salvar(conta)
    return _serializar(conta), None


def editar_conta(conta_id, usuario_id, descricao, valor, vencimento_str):
    if not descricao or not valor or not vencimento_str:
        return None, "Todos os campos são obrigatórios"

    try:
        valor_float = float(valor)
        if valor_float <= 0:
            return None, "O valor deve ser maior que zero"
    except ValueError:
        return None, "Valor inválido"

    try:
        vencimento = datetime.strptime(vencimento_str, "%Y-%m-%d").date()
    except ValueError:
        return None, "Data inválida. Use o formato AAAA-MM-DD"

    conta = repositorio.buscar_por_id(conta_id, usuario_id)
    if not conta:
        return None, "Conta não encontrada"

    repositorio.atualizar(conta, descricao, valor_float, vencimento)
    return _serializar(conta), None


def pagar_conta(conta_id, usuario_id):
    conta = repositorio.buscar_por_id(conta_id, usuario_id)
    if not conta:
        return None, "Conta não encontrada"
    if conta.paga:
        return None, "Conta já está paga"
    repositorio.marcar_paga(conta)
    return _serializar(conta), None


def excluir_conta(conta_id, usuario_id):
    conta = repositorio.buscar_por_id(conta_id, usuario_id)
    if not conta:
        return None, "Conta não encontrada"
    repositorio.excluir(conta)
    return True, None


def _serializar(conta):
    return {
        "id": conta.id,
        "descricao": conta.descricao,
        "valor": conta.valor,
        "vencimento": conta.vencimento.strftime("%Y-%m-%d"),
        "paga": conta.paga,
        "dias_para_vencer": conta.dias_para_vencer()
    }