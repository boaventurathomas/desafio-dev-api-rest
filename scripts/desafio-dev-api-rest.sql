SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema desafio-dev-api-rest
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema desafio-dev-api-rest
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `desafio-dev-api-rest` DEFAULT CHARACTER SET latin1 ;
USE `desafio-dev-api-rest` ;

-- -----------------------------------------------------
-- Table `desafio-dev-api-rest`.`portador`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `desafio-dev-api-rest`.`portador` (
  `cpf` VARCHAR(11) NOT NULL,
  `nome_completo` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`cpf`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `desafio-dev-api-rest`.`conta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `desafio-dev-api-rest`.`conta` (
  `agencia` VARCHAR(4) NOT NULL,
  `conta` VARCHAR(8) NOT NULL,
  `saldo` DECIMAL(15,2) NOT NULL DEFAULT '0.00',
  `portadorCpf` VARCHAR(11) NULL DEFAULT NULL,
  `ativo` TINYINT(4) NOT NULL DEFAULT '1',
  `limite_saque_diario` DECIMAL(15,2) NOT NULL DEFAULT '2000.00',
  PRIMARY KEY (`agencia`, `conta`),
  INDEX `FK_f87b37c3d2b83216585a83978be` (`portadorCpf` ASC) VISIBLE,
  INDEX `IDX_bb1bea79caeb9f6373737480c9` (`agencia` ASC) VISIBLE,
  INDEX `IDX_e46577bf6e961a90081e0ca64f` (`conta` ASC) VISIBLE,
  CONSTRAINT `FK_f87b37c3d2b83216585a83978be`
    FOREIGN KEY (`portadorCpf`)
    REFERENCES `desafio-dev-api-rest`.`portador` (`cpf`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `desafio-dev-api-rest`.`transacao`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `desafio-dev-api-rest`.`transacao` (
  `id_transacao` VARCHAR(36) NOT NULL,
  `valor` DECIMAL(15,2) NOT NULL,
  `data_transacao` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `agencia` VARCHAR(4) NOT NULL,
  `conta` VARCHAR(8) NOT NULL,
  PRIMARY KEY (`id_transacao`),
  INDEX `FK_5d87f8f4e3c17cb35deb5fa75f7` (`agencia` ASC, `conta` ASC) VISIBLE,
  CONSTRAINT `FK_5d87f8f4e3c17cb35deb5fa75f7`
    FOREIGN KEY (`agencia` , `conta`)
    REFERENCES `desafio-dev-api-rest`.`conta` (`agencia` , `conta`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
