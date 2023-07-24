NAME				:=  transedence

RM					:=  rm -f

all:	$(NAME)

$(NAME):
		docker compose up --build -d

clean:		
		docker compose down --remove-orphans --rmi all

fclean:
		rm -r ./postgre
		mkdir ./postgre
		docker compose down --remove-orphans -v --rmi all

re:			fclean all

.PHONY:			all clean fclean re