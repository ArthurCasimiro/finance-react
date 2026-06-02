from extensao import bd
from modelos.financeiro import Conta


class ContaRepositorio:

    def listar_por_usuario(self, usuario_id):
        return Conta.query.filter_by(usuario_id=usuario_id).order_by(Conta.vencimento).all()

    def buscar_por_id(self, conta_id, usuario_id):
        return Conta.query.filter_by(id=conta_id, usuario_id=usuario_id).first()

    def salvar(self, conta):
        bd.session.add(conta)
        bd.session.commit()
        return conta

    def excluir(self, conta):
        bd.session.delete(conta)
        bd.session.commit()

    def marcar_paga(self, conta):
        conta.paga = True
        bd.session.commit()
        return conta

    def atualizar(self, conta, descricao, valor, vencimento):
        conta.descricao = descricao
        conta.valor = valor
        conta.vencimento = vencimento
        bd.session.commit()
        return conta