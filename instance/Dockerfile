FROM archlinux

RUN pacman -Syu --noconfirm base-devel
RUN pacman -Syu --noconfirm nodejs npm python3

WORKDIR /usr/src/app

COPY . .
ENTRYPOINT ["/bin/bash"]
