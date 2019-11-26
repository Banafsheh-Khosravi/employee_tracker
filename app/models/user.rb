# frozen_string_literal: true

class User < ApplicationRecord
  enum role: %i[employee admin]
  after_initialize :set_default_role, :set_password, if: :new_record?
  after_create :send_welcome_mail

  has_many :employee_skill
  has_many :skills, through: :employee_skill

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: Devise::JWT::RevocationStrategies::Null

  def set_default_role
    self.role ||= :employee
  end

  def set_password
    @generated_password = Devise.friendly_token.first(8)
    self.password ||= @generated_password
  end

  def send_welcome_mail
    pp '======='
    pp @generated_password
    pp '======='
  end
end
