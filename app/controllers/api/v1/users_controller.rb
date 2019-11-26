# frozen_string_literal: true

class Api::V1::UsersController < ApplicationController
  # check for token
  before_action :authenticate_user!

  def index
    @employee = User.employee
    @employee = @employee
                .joins(:employee_skill)
                .where(employee_skills: { proficiency: params[:q] }) if params[:q] && params[:q] != "all"
  end

  def create
    user = User.new(employee_params)

    if user.save
      render json: user, status: :created
    else
      render json: user.errors
    end
  end

  def user_dashboard_info
    @user = User.find(current_user.id)

    if @user
      @user
    else
      render json: @user.errors
    end
  end

  def user_skill_info
    @user = User.find(params[:id])
  end

  private

  def employee_params
    params.require(:user).permit(:email, :full_name, :q)
  end
end
